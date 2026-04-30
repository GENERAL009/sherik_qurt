from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, F

from .models import Product, Transaction
from .serializers import ProductSerializer, TransactionSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated] # Disable for easy testing first

@api_view(['GET'])
def dashboard_stats(request):
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_ago = now - timedelta(days=30)
    
    # 1. Bugun chiqib ketgan tovarlar soni (dona)
    today_out = Transaction.objects.filter(
        type='OUT', 
        created_at__gte=today_start
    ).aggregate(total=Sum('quantity'))['total'] or 0
    
    # 2. 1 oyda chiqib ketgan tovarlar summasi (UZS)
    month_out_transactions = Transaction.objects.filter(
        type='OUT',
        created_at__gte=month_ago
    )
    # Summa = quantity * product.price
    month_out_sum = month_out_transactions.annotate(
        total_price=F('quantity') * F('product__price')
    ).aggregate(sum=Sum('total_price'))['sum'] or 0

    return Response({
        "today_out_quantity": today_out,
        "month_out_sum": month_out_sum
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def scan_in(request):
    barcode = request.data.get('barcode')
    quantity = request.data.get('quantity', 1)
    
    try:
         quantity = int(quantity)
         if quantity <= 0:
              return Response({"error": "Quantity must be positive"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
         return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

    if not barcode:
        return Response({"error": "Barcode is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    product, created = Product.objects.get_or_create(
        barcode=barcode,
        defaults={
            'name': 'Yangi Mahsulot',
            'type': 'Noma\'lum',
            'quantity': 0,
            'weight': '-',
            'price': 0.00
        }
    )
    
    product.quantity += quantity
    product.save()
    
    Transaction.objects.create(
        product=product,
        type='IN',
        quantity=quantity
    )
    
    return Response({
        "message": "Muvaffaqiyatli qo'shildi" if created else "Soni oshirildi",
        "product": ProductSerializer(product).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def scan_out(request):
    barcode = request.data.get('barcode')
    quantity = request.data.get('quantity', 1)
    
    try:
         quantity = int(quantity)
         if quantity <= 0:
              return Response({"error": "Quantity must be positive"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
         return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

    if not barcode:
        return Response({"error": "Barcode is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        product = Product.objects.get(barcode=barcode)
    except Product.DoesNotExist:
        return Response({"error": "Mahsulot topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        
    if product.quantity < quantity:
        return Response({"error": "Omborda yetarli mahsulot yo'q"}, status=status.HTTP_400_BAD_REQUEST)
        
    product.quantity -= quantity
    product.save()
    
    Transaction.objects.create(
        product=product,
        type='OUT',
        quantity=quantity,
        price_at_transaction=product.price,
        comment=request.data.get('comment', '')
    )
    
    return Response({
        "message": "Muvaffaqiyatli sotildi",
        "product": ProductSerializer(product).data
    }, status=status.HTTP_200_OK)

class WithdrawalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.filter(type='OUT').order_by('-created_at')
    serializer_class = TransactionSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Calculate total sum of all withdrawals
        total_sum = queryset.aggregate(
            total=Sum(F('quantity') * F('price_at_transaction'))
        )['total'] or 0
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "results": serializer.data,
            "total_sum": total_sum
        })

