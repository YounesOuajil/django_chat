# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.layers import get_channel_layer
# from asgiref.sync import sync_to_async
# from authentication.models import Message,User  # Import the Message model
# import json

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.sender_id = self.scope['url_route']['kwargs']['sender_id']
#         self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
#         self.sender_channel_name = f"user_{self.sender_id}"
#         self.receiver_channel_name = f"user_{self.receiver_id}"

#         # Add sender to its own channel group
#         await self.channel_layer.group_add(
#             self.sender_channel_name,
#             self.channel_name
#         )

#         # Add receiver to its own channel group
#         await self.channel_layer.group_add(
#             self.receiver_channel_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Remove sender from its channel group upon disconnection
#         await self.channel_layer.group_discard(
#             self.sender_channel_name,
#             self.channel_name
#         )

#         # Remove receiver from its channel group upon disconnection
#         await self.channel_layer.group_discard(
#             self.receiver_channel_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data['message']

#         # Save the message
#         await self.save_message(message)

#         # Send message to both sender's and receiver's channel groups
#         await self.channel_layer.group_send(
#             self.sender_channel_name,
#             {
#                 "type": "chat.message",
#                 "message": message,
#                 "sender_id": self.sender_id,
                
#             }
#         )

      
#     async def chat_message(self, event):
#         message = event['message']
#         sender_id = event['sender_id']
        
        
#         # Send message back to sender
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender_id': sender_id,
            
            
#         }))

#     @sync_to_async
#     def save_message(self, message):
#         # Retrieve sender and recipient user objects
#         sender = User.objects.get(id=self.sender_id)
#         recipient = User.objects.get(id=self.receiver_id)

#         # Create and save message to the database
#         Message.objects.create(sender=sender, recipient=recipient, content=message)
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.layers import get_channel_layer
# from asgiref.sync import sync_to_async
# from authentication.models import Message, User
# import json

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.sender_id = self.scope['url_route']['kwargs']['sender_id']
#         self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
#         self.sender_channel_name = f"user_{self.sender_id}"
#         self.receiver_channel_name = f"user_{self.receiver_id}"

#         await self.channel_layer.group_add(self.sender_channel_name, self.channel_name)
#         await self.channel_layer.group_add(self.receiver_channel_name, self.channel_name)

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.sender_channel_name, self.channel_name)
#         await self.channel_layer.group_discard(self.receiver_channel_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         if "message" in data:
#             message = data['message']
#             await self.save_message(message)
#             await self.channel_layer.group_send(self.sender_channel_name, {
#                 "type": "chat.message",
#                 "message": message,
#                 "sender_id": self.sender_id,
#             })
#         else:
#             await self.channel_layer.group_send(self.receiver_channel_name, data)

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps({
#             'message': event['message'],
#             'sender_id': event['sender_id'],
#         }))

#     @sync_to_async
#     def save_message(self, message):
#         sender = User.objects.get(id=self.sender_id)
#         recipient = User.objects.get(id=self.receiver_id)
#         Message.objects.create(sender=sender, recipient=recipient, content=message)

#     async def offer(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent offer:", event)

#     async def answer(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent answer:", event)

#     async def candidate(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent ICE candidate:", event)

# from channels.generic.websocket import AsyncWebsocketConsumer^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# from channels.layers import get_channel_layer
# from asgiref.sync import sync_to_async
# from authentication.models import Message, User
# import json

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.sender_id = self.scope['url_route']['kwargs']['sender_id']
#         self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
#         self.sender_channel_name = f"user_{self.sender_id}"
#         self.receiver_channel_name = f"user_{self.receiver_id}"

#         await self.channel_layer.group_add(self.sender_channel_name, self.channel_name)
#         await self.channel_layer.group_add(self.receiver_channel_name, self.channel_name)

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.sender_channel_name, self.channel_name)
#         await self.channel_layer.group_discard(self.receiver_channel_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         if "message" in data:
#             message = data['message']
#             await self.save_message(message)
#             await self.channel_layer.group_send(self.sender_channel_name, {
#                 "type": "chat.message",
#                 "message": message,
#                 "sender_id": self.sender_id,
#             })
#         else:
#             await self.channel_layer.group_send(self.receiver_channel_name, data)

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps({
#             'message': event['message'],
#             'sender_id': event['sender_id'],
#         }))

#     @sync_to_async
#     def save_message(self, message):
#         sender = User.objects.get(id=self.sender_id)
#         recipient = User.objects.get(id=self.receiver_id)
#         Message.objects.create(sender=sender, recipient=recipient, content=message)

#     async def offer(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent offer:", event)

#     async def answer(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent answer:", event)

#     async def candidate(self, event):
#         await self.send(text_data=json.dumps(event))
#         print("Sent ICE candidate:", event)
# consumers.py
# Backend: Django Channels Consumer
# chat/consumers.pypppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.layers import get_channel_layer
# from asgiref.sync import sync_to_async
# from authentication.models import Message, User
# import json

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.sender_id = self.scope['url_route']['kwargs']['sender_id']
#         self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
#         self.sender_channel_name = f"user_{self.sender_id}"
#         self.receiver_channel_name = f"user_{self.receiver_id}"

#         await self.channel_layer.group_add(
#             self.sender_channel_name,
#             self.channel_name
#         )

#         await self.channel_layer.group_add(
#             self.receiver_channel_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.sender_channel_name,
#             self.channel_name
#         )

#         await self.channel_layer.group_discard(
#             self.receiver_channel_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message_type = data.get('type')
        
#         if message_type == 'chat_message':
#             await self.handle_chat_message(data)
#         elif message_type == 'offer':
#             await self.handle_offer(data)
#         elif message_type == 'answer':
#             await self.handle_answer(data)
#         elif message_type == 'ice_candidate':
#             await self.handle_ice_candidate(data)

#     async def handle_chat_message(self, data):
#         message = data['message']
#         await self.save_message(message)
#         await self.channel_layer.group_send(
#             self.sender_channel_name,
#             {
#                 "type": "chat.message",
#                 "message": message,
#                 "sender_id": self.sender_id,
#             }
#         )

#     async def handle_offer(self, data):
#         await self.channel_layer.group_send(
#             self.receiver_channel_name,
#             {
#                 "type": "webrtc.offer",
#                 "offer": data['offer'],
#                 "sender_id": self.sender_id,
#             }
#         )

#     async def handle_answer(self, data):
#         await self.channel_layer.group_send(
#             self.receiver_channel_name,
#             {
#                 "type": "webrtc.answer",
#                 "answer": data['answer'],
#                 "sender_id": self.sender_id,
#             }
#         )

#     async def handle_ice_candidate(self, data):
#         await self.channel_layer.group_send(
#             self.receiver_channel_name,
#             {
#                 "type": "webrtc.ice_candidate",
#                 "candidate": data['candidate'],
#                 "sender_id": self.sender_id,
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']
#         sender_id = event['sender_id']
#         await self.send(text_data=json.dumps({
#             'type': 'chat_message',
#             'message': message,
#             'sender_id': sender_id,
#         }))

#     async def webrtc_offer(self, event):
#         await self.send(text_data=json.dumps({
#             'type': 'offer',
#             'offer': event['offer'],
#             'sender_id': event['sender_id'],
#         }))

#     async def webrtc_answer(self, event):
#         await self.send(text_data=json.dumps({
#             'type': 'answer',
#             'answer': event['answer'],
#             'sender_id': event['sender_id'],
#         }))

#     async def webrtc_ice_candidate(self, event):
#         await self.send(text_data=json.dumps({
#             'type': 'ice_candidate',
#             'candidate': event['candidate'],
#             'sender_id': event['sender_id'],
#         }))

#     @sync_to_async
#     def save_message(self, message):
#         sender = User.objects.get(id=self.sender_id)
#         recipient = User.objects.get(id=self.receiver_id)
#         Message.objects.create(sender=sender, recipient=recipient, content=message)
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from authentication.models import Message, User
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        self.sender_channel_name = f"user_{self.sender_id}"
        self.receiver_channel_name = f"user_{self.receiver_id}"

        await self.channel_layer.group_add(
            self.sender_channel_name,
            self.channel_name
        )

        await self.channel_layer.group_add(
            self.receiver_channel_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.sender_channel_name,
            self.channel_name
        )

        await self.channel_layer.group_discard(
            self.receiver_channel_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'chat_message':
            await self.handle_chat_message(data)
        elif message_type == 'offer':
            await self.handle_offer(data)
        elif message_type == 'answer':
            await self.handle_answer(data)
        elif message_type == 'ice_candidate':
            await self.handle_ice_candidate(data)

    async def handle_chat_message(self, data):
        message = data['message']
        await self.save_message(message)
        await self.channel_layer.group_send(
            self.sender_channel_name,
            {
                "type": "chat.message",
                "message": message,
                "sender_id": self.sender_id,
            }
        )

    async def handle_offer(self, data):
        await self.channel_layer.group_send(
            self.receiver_channel_name,
            {
                "type": "webrtc.offer",
                "offer": data['offer'],
                "sender_id": self.sender_id,
            }
        )

    async def handle_answer(self, data):
        await self.channel_layer.group_send(
            self.receiver_channel_name,
            {
                "type": "webrtc.answer",
                "answer": data['answer'],
                "sender_id": self.sender_id,
            }
        )

    async def handle_ice_candidate(self, data):
        await self.channel_layer.group_send(
            self.receiver_channel_name,
            {
                "type": "webrtc.ice_candidate",
                "candidate": data['candidate'],
                "sender_id": self.sender_id,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender_id': sender_id,
        }))

    async def webrtc_offer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'offer',
            'offer': event['offer'],
            'sender_id': event['sender_id'],
        }))

    async def webrtc_answer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'answer',
            'answer': event['answer'],
            'sender_id': event['sender_id'],
        }))

    async def webrtc_ice_candidate(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ice_candidate',
            'candidate': event['candidate'],
            'sender_id': event['sender_id'],
        }))

    @sync_to_async
    def save_message(self, message):
        sender = User.objects.get(id=self.sender_id)
        recipient = User.objects.get(id=self.receiver_id)
        Message.objects.create(sender=sender, recipient=recipient, content=message)