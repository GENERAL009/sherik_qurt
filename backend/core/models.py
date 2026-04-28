from django.db import models
from django.core.validators import MinValueValidator

class Product(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100) # e.g. rayhonli, magizli, oddiy katta
    barcode = models.CharField(max_length=100, unique=True, db_index=True)
    production_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    weight = models.CharField(max_length=50) # e.g. 50g, 100g
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.barcode}"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('IN', 'Kirim (Income)'),
        ('OUT', 'Chiqim (Outcome)'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.type} - {self.product.name} ({self.quantity})"
