import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  constructor(private route: ActivatedRoute, private token: TokenService) { }

  id = this.route.snapshot.params['id'];
  name = this.route.snapshot.params['name'];
  
  ngOnInit(): void {
    console.log(this.id);
  }

}
