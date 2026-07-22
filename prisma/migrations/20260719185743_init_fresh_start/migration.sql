-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role_key" TEXT NOT NULL,
    "role_label" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#5C8CE8',
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agent',
    "pin_hash" TEXT NOT NULL,
    "biometric_key" TEXT,
    "is_active" INTEGER NOT NULL DEFAULT 1,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "last_login" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "jwt_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "is_offline" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_queue" (
    "id" SERIAL NOT NULL,
    "table_name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount_charge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_owners" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "national_id" TEXT,
    "location" TEXT,
    "date_of_birth" TIMESTAMP(6),
    "allow_multiple_businesses" INTEGER NOT NULL DEFAULT 0,
    "max_businesses_count" INTEGER NOT NULL DEFAULT 1,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" SERIAL NOT NULL,
    "business_name" TEXT NOT NULL,
    "registration_number" TEXT,
    "business_type_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "tax_number" TEXT,
    "is_active" INTEGER NOT NULL DEFAULT 1,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "is_synced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key_key" ON "roles"("role_key");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_types_name_key" ON "business_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_national_id_key" ON "business_owners"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_registration_number_key" ON "businesses"("registration_number");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("role_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "business_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "business_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
