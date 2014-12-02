from django.db import models
from user.models import User


class View(models.Model):
    url = models.URLField(db_index=True)
    ip = models.CharField(max_length=39, db_index=True)
    date = models.DateTimeField(auto_now_add=True, auto_now=False)
    user = models.ForeignKey(User, null=True, blank=True)
    staff = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return "{0}, vu par {1} le {2}, utilisateur {3}.".format(self.url,
                self.ip, self.date, self.user)


