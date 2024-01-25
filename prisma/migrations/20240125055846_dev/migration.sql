-- CreateTable
CREATE TABLE "Broadcast" (
    "broadcastId" UUID NOT NULL,
    "senderUid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "name" TEXT,
    "countryCode" TEXT,
    "longitude" TEXT,
    "latitude" BOOLEAN,

    CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("broadcastId")
);
