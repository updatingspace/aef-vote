from __future__ import annotations

from django.contrib import admin

from .models import TelegramProfile


@admin.register(TelegramProfile)
class TelegramProfileAdmin(admin.ModelAdmin):
    list_display = ("telegram_id", "username", "user", "linked_at", "updated_at")
    search_fields = ("telegram_id", "username", "user__username", "user__email")
    readonly_fields = ("linked_at", "updated_at", "auth_date")
