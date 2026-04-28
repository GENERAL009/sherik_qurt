class PaymentAdapter:
    def pay(self, amount):
        pass

class PaymeAdapter(PaymentAdapter):
    def pay(self, amount):
        pass
        # payme logika

class FakePaymentAdapter(PaymentAdapter):
    def pay(self, amount):
        return True