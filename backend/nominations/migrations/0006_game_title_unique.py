from django.db import migrations


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("nominations", "0005_alter_voting_code"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nominations_game_title_key'
    ) THEN
        ALTER TABLE nominations_game
            ADD CONSTRAINT nominations_game_title_key UNIQUE (title);
    END IF;
END$$;
""",
            reverse_sql="""
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nominations_game_title_key'
    ) THEN
        ALTER TABLE nominations_game
            DROP CONSTRAINT nominations_game_title_key;
    END IF;
END$$;
""",
        ),
    ]
