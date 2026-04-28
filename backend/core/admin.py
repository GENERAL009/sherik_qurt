from django.contrib import admin
from .models import Product, Transaction

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'barcode', 'quantity', 'price')
    search_fields = ('name', 'barcode')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('product', 'type', 'quantity', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('product__name',)
