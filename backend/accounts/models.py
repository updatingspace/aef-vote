from __future__ import annotations

import uuid
from pathlib import Path

from django.conf import settings
from django.db import models


def user_avatar_upload_to(instance: UserProfile, filename: str) -> str:
    """
    Store avatars inside per-user folders to avoid name collisions.
    """
    ext = Path(filename).suffix or ".jpg"
    return f"avatars/user_{instance.user_id}/{uuid.uuid4().hex}{ext}"


class UserProfile(models.Model):
    class AvatarSource(models.TextChoices):
        NONE = "none", "Нет"
        GRAVATAR = "gravatar", "Gravatar"
        UPLOAD = "upload", "Загрузка"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    avatar = models.ImageField(upload_to=user_avatar_upload_to, null=True, blank=True)
    avatar_source = models.CharField(
        max_length=16,
        choices=AvatarSource.choices,
        default=AvatarSource.NONE,
    )
    gravatar_enabled = models.BooleanField(
        default=True,
        help_text="Разрешать авто-подгрузку аватара из Gravatar, пока пользователь сам не загружает/не удаляет фото.",
    )
    gravatar_checked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self) -> str:  # pragma: no cover - административное удобство
        return f"Profile({self.user_id})"


__all__ = ["UserProfile", "user_avatar_upload_to"]
