import {Module} from '@nestjs/common';
import {NotificationsGateway} from "../../infra/notification/notifications.gateway";

@Module({
    providers: [NotificationsGateway],
    exports: [NotificationsGateway],
})
export class NotificationsModule {
}
