import axios from 'axios'
import config from '../config/config'

class ApiServices{
    apiClient;

    constructor (){
        this.apiClient = axios.create({
            baseURL: config.apiurl,
            withCredentials: true,
            headers: {accept: 'application/json', 'content-type': 'application/json'},
            timeout: 120000
        })
    }

    async register({email, username, password}){
        try {
            const {data} = await this.apiClient.post('/users/register',{
                email,
                username,
                password
            })

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async login({username, password}){
        try {
            const {data} = await this.apiClient.post('/users/login',{
                username, 
                password
            })

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async logout(){
        try {
            const {data} = await this.apiClient.post('/users/logout')

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const {data} = await this.apiClient.get('/users/current-user')
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async refreshAccessToken(){
        try {
            return await this.apiClient.post('/users/refresh-token')
        } catch (error) {
            throw error
        }
    }

    async getUserChats(){
        try {
            const {data} = await this.apiClient.get('/chat-app/chats')
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async getAvailableUsers(){
        try {
            const {data} = await this.apiClient.get('/chat-app/chats/users')

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async createUserChat(receiverId){
        try {
            const {data} = await this.apiClient.post(`/chat-app/chats/c/${receiverId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async deleteUserChat(chatId){
        try {
            const {data} = await this.apiClient.delete(`/chat-app/chats/remove/${chatId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async createGroupChat({name, participants}){
        try {
            const {data} = await this.apiClient.post('/chat-app/chats/group',{
                name,
                participants
            })
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async getGroupInfo(chatId){
        try {
            const {data} = await this.apiClient.get(`/chat-app/chats/group/${chatId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async deleteGroup(chatId){
        try {
            const {data} = await this.apiClient.delete(`/chat-app/chats/group/${chatId}`)

            return data || null;
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateGroupName(chatId, name){
        try {
            const {data} = await this.apiClient.patch(`/chat-app/chats/group/${chatId}`,{name})
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async addParticipantToGroup(chatId, participantId){
        try {
            const {data} = await this.apiClient.post(`/chat-app/chats/group/${chatId}/${participantId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async removeParticipantFromGroup(chatId, participantId){
        try {
            const {data} = await this.apiClient.delete(`/chat-app/chats/group/${chatId}/${participantId}`)

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async leaveGroup({chatId}){
        try {
            const {data} = await this.apiClient.delete(`/chat-app/chats/leave/group/${chatId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }

    async getChatMessages(chatId){
        try {
            const {data} = await this.apiClient.get(`/chat-app/messages/${chatId}`)

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async sendMessage(chatId, content, attachments){
        const formData = new FormData()

        if(content){
            formData.append("content", content)
        }

        attachments?.map((file) => {
            formData.append("attachments", file)
        })

        try {
            const {data} = await this.apiClient.post(`/chat-app/messages/${chatId}`,formData,{
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            return data || null;
        } catch (error) {
            throw error
        }
    }

    async deleteMessage(chatId, messageId){
        try {
            const {data} = await this.apiClient.delete(`/chat-app/messages/${chatId}/${messageId}`)
            
            return data || null;
        } catch (error) {
            throw error
        }
    }
};

const apiServices = new ApiServices()

export default apiServices;