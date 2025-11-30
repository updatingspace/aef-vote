from __future__ import annotations

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="TelegramProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("telegram_id", models.BigIntegerField(db_index=True, unique=True)),
                ("username", models.CharField(blank=True, max_length=64)),
                ("first_name", models.CharField(blank=True, max_length=255)),
                ("last_name", models.CharField(blank=True, max_length=255)),
                ("photo_url", models.URLField(blank=True)),
                ("auth_date", models.DateTimeField(default=django.utils.timezone.now)),
                ("linked_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="telegram_profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Telegram профиль",
                "verbose_name_plural": "Telegram профили",
            },
        ),
    ]
