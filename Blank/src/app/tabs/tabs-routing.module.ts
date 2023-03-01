import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/tab/list',
      },
      {
        path: 'list',
        loadChildren: () =>
          import('../chats-tab/chats-tab.module').then(
            (m) => m.ChatsTabPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile-tab/profile-tab.module').then(
            (m) => m.ProfileTabPageModule
          ),
      },

      {
        path: 'contacts',
        loadChildren: () =>
          import('../contact-tab/contact-tab.module').then(
            (m) => m.ContactTabPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
