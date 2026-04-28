from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, scan_in, scan_out, dashboard_stats

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/stats/', dashboard_stats, name='dashboard-stats'),
    path('api/scan/in/', scan_in, name='scan-in'),
    path('api/scan/out/', scan_out, name='scan-out'),
]
