import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ChatService } from '../../services/chat.service';
import { SignalRService } from '../../services/signal-r.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
interface Message {
  text: string;
  time: Date;
  isMine: boolean;
  isCollapsed: boolean;
}
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody', { static: false }) private chatBody!: ElementRef;

  chatId: number = 0;
  chatData: any;

  chatPartner = {
    name: '',
    imageUrl: '',
  };

  myImageUrl = 'https://via.placeholder.com/40';
  newMessage = '';
  messages: Message[] = [];
  myUserId: string = '';
  reciverId: string = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private signalrService: SignalRService
  ) {
    this.signalrService.startChatHubConnection();
  }

  ngOnInit(): void {
    this.reciverId = localStorage.getItem('ownerId') || ''; // Default to empty string if null
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.myUserId = decodedToken.uid;
      console.log(decodedToken.uid);
    }

    this.route.params.subscribe((params) => {
      this.chatId = +params['id'];
      this.loadChat(this.chatId);
    });

    this.signalrService.newMessageReceivedListener((date) => {
      this.onMessageReceived(date);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const newMessage: Message = {
        text: this.newMessage,
        time: new Date(),
        isMine: true,
        isCollapsed: true,
      };
      this.messages.push(newMessage);
      this.newMessage = '';
      this.scrollToBottom();
      this.signalrService.sendMessage(newMessage.text, this.reciverId); // Send message via SignalrService
    }
  }

  sendAttachment(): void {
    // Implement attachment functionality if needed
  }

  toggleMessage(message: Message): void {
    message.isCollapsed = !message.isCollapsed;
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  loadChat(chatId: number): void {
    this.chatService.getChatById(chatId).subscribe(
      (response: any) => {
        console.log(response);
        this.chatData = response.data;
        this.chatPartner.name = response.data.user.userName;
        this.chatPartner.imageUrl = `${environment.UrlForImages}${response.data.user.profileImage}`;
        this.messages = response.data.messages.map((msg: any) => ({
          text: msg.message,
          time: new Date(msg.sentAt),
          isMine: msg.senderId === this.myUserId,
          isCollapsed: true,
        }));
      },
      (error: any) => {
        console.error('Error fetching chat data', error);
      }
    );
  }
  onMessageReceived(message: any): void {
    console.log('Get New Message ');
    this.messages.push({
      text: message.message,
      time: message.sentAt,
      isMine: false,
      isCollapsed: true,
    });
    this.scrollToBottom();
  }
}
