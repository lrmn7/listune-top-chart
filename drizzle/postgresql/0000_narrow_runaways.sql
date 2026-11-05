CREATE TABLE "TrackCurrent" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"trackId" varchar(255),
	"trackName" varchar(500) NOT NULL,
	"artistName" varchar(255) NOT NULL,
	"country" varchar(10) DEFAULT 'global' NOT NULL,
	"rank" integer NOT NULL,
	"previousRank" integer,
	"rankDelta" integer,
	"dailyStreams" bigint NOT NULL,
	"totalStreams" bigint,
	"imageUrl" varchar(500),
	"previewUrl" varchar(500),
	"spotifyUrl" varchar(500),
	"lastUpdated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TrackSnapshot" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"trackName" varchar(500) NOT NULL,
	"artistName" varchar(255) NOT NULL,
	"country" varchar(10) DEFAULT 'global' NOT NULL,
	"rank" integer NOT NULL,
	"dailyStreams" bigint NOT NULL,
	"totalStreams" bigint,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "TrackCurrent_trackName_artistName_country_key" ON "TrackCurrent" USING btree ("trackName","artistName","country");--> statement-breakpoint
CREATE INDEX "TrackCurrent_rank_idx" ON "TrackCurrent" USING btree ("rank");--> statement-breakpoint
CREATE INDEX "TrackCurrent_trackName_artistName_idx" ON "TrackCurrent" USING btree ("trackName","artistName");--> statement-breakpoint
CREATE INDEX "TrackCurrent_country_idx" ON "TrackCurrent" USING btree ("country");--> statement-breakpoint
CREATE INDEX "TrackSnapshot_createdAt_idx" ON "TrackSnapshot" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "TrackSnapshot_trackName_artistName_idx" ON "TrackSnapshot" USING btree ("trackName","artistName");--> statement-breakpoint
CREATE INDEX "TrackSnapshot_country_idx" ON "TrackSnapshot" USING btree ("country");