import * as awilix from "awilix";
import BotSettings from "./entities/BotSettings";
import { Feed } from "./entities/Feed";
import IlDolomitiFilter from "./filters/IlDolomitiFilter";
import IlDolomitiFormatter from "./formatters/IlDolomitiFormatter";
import LaBusaFilter from "./filters/LaBusaFilter";
import LaBusaFormatter from "./formatters/LaBusaFormatter";
import logger from "./logger";
import { FeedReaderService } from "./services/FeedReaderService";
import { PollingService } from "./services/PollingService";
import { TelegramService } from "./services/TelegramService";

process.on("unhandledRejection", err => {
    logger.error("Unhandled rejection:", err);
});

logger.info("Initializing container...");

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
});

const FEEDS: Feed[] = [
    new Feed("https://www.ildolomiti.it/rss.xml",
        new IlDolomitiFilter(),
        new IlDolomitiFormatter(),
        "@ildolomitinews"),
    new Feed("https://labusa.info/feed/",
        new LaBusaFilter(),
        new LaBusaFormatter(),
        "@labusanews"),
];

container.register({
    feeds: awilix.asValue(FEEDS),
    botSettings: awilix.asValue(new BotSettings(process.env.BOT_TOKEN)),
    feedReaderService: awilix.asClass(FeedReaderService).transient(),
    pollingService: awilix.asClass(PollingService).singleton(),
    telegramService: awilix.asClass(TelegramService).singleton(),
});

const pollingService = container.resolve<PollingService>("pollingService");
pollingService.start();
