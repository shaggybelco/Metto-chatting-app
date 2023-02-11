import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tab',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'chats-tab',
    loadChildren: () => import('./chats-tab/chats-tab.module').then( m => m.ChatsTabPageModule)
  },
  {
    path: 'profile-tab',
    loadChildren: () => import('./profile-tab/profile-tab.module').then( m => m.ProfileTabPageModule)
  },
  {
    path: 'contact-tab',
    loadChildren: () => import('./contact-tab/contact-tab.module').then( m => m.ContactTabPageModule)
  },
  {
    path: 'message/:id/:name/:type',
    loadChildren: () => import('./message/message.module').then( m => m.MessagePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
