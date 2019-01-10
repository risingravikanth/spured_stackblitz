import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerCookiesModule } from '@ngx-utils/cookies/server';

 
import { AppModule } from './app.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerCookiesModule.forRoot(),
    ModuleMapLoaderModule,
    ServerTransferStateModule
  ],
  bootstrap: [ AppComponent ] 
})
export class AppServerModule {}