from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.BigIntField(pk=True)
    username = fields.CharField(max_length=255, null=True)
    balance = fields.FloatField(null=True,default=0.000)
    start_farm_time = fields.DatetimeField(null=True)
    # earns = fields.BooleanField(null=False)