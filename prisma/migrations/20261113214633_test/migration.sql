BEGIN;

ALTER TABLE "Order" ADD COLUMN "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE "Order"
SET "metadata" = jsonb_strip_nulls(jsonb_build_object(
  'comment', "comment",
  'imageFile', "imageFile"
))
WHERE "comment" IS NOT NULL OR "imageFile" IS NOT NULL;

COMMIT;
