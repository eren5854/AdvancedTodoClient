import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { TodoModel } from '../../models/todo.model';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isCreateModalActive:boolean = false;
  isUpdateModalActive:boolean = false;
  isUserModalActive:boolean = false;

  userModel: UserModel = new UserModel();
  todoModel: TodoModel = new TodoModel();
  updateTodoModel: TodoModel = new TodoModel();
  todos: TodoModel[] = [];

  coin:number = 0;
  imageUrl:string = "";
  selectedSkillNo?:number;

  avatars: string[] = ["7309681.jpg", "7309683.jpg", "7309703.jpg"]

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private swal: SwalService
  ){
    this.getUserById();
    this.imageUrl = http.getImageUrl();
  }

  getUserById(){
    this.http.get(`Users/GetById?Id=${this.auth.user.id}`, (res) => {
      this.userModel = res.data;
      console.log(this.userModel);
      this.todos = this.userModel.todos.sort((a: { isCompleted: any; }, b: { isCompleted: any; }) => Number(a.isCompleted) - Number(b.isCompleted));
      console.log(this.todos);
      
      this.coin = this.userModel.skillInfo.strength + this.userModel.skillInfo.intelligence + this.userModel.skillInfo.charisma + this.userModel.skillInfo.creativity;
    })
  }

  updateUser(form:NgForm){
    if(form.valid){
      this.http.post("Users/Update", this.userModel, (res) => {
        console.log(res);
        this.swal.callToast(res.data, "success");
        this.getUserById();
        this.isUserModalActive = false;
      })
    }
  }

  createTodo(form:NgForm){
    this.todoModel.skill = this.selectedSkillNo;
    this.todoModel.userId = this.auth.user.id!;
    if(form.valid){
      this.http.post("Todos/Create", this.todoModel, (res) => {
        console.log(res.data);
        this.swal.callToast(res.data, "success");
        this.isCreateModalActive = false;
        this.getUserById();
      });
    }
  }

  updateTodo(form:NgForm){
    this.updateTodoModel.skill = this.selectedSkillNo;
    if (form.valid) {
      this.http.post("Todos/Update", this.updateTodoModel, (res) => {
        console.log(res);
        this.swal.callToast(res.data, "success");
        this.getUserById();
        this.selectedSkillNo = null!;
        this.isUpdateModalActive = false;
      })
    }
  }

  updateTodoStatus(id:string){
    this.http.get(`Todos/UpdateStatus?Id=${id}`, (res) => {
      console.log(res);
      this.swal.callToast(res.data, "success");
      this.getUserById();
    })
  }

  deleteTodo(id:string){
    this.http.get(`Todos/Delete?Id=${id}`, (res) => {
      console.log(res);
      this.getUserById();
    })
  }

  activeCreateModal(){
    this.isCreateModalActive = !this.isCreateModalActive;
  }

  activeUpdateModal(todo:TodoModel){
    this.updateTodoModel = todo;
    this.isUpdateModalActive = !this.isUpdateModalActive;
  }

  activeUserModal(){
    this.isUserModalActive = !this.isUserModalActive;
  }

  onSkillChange(event: any) {
    this.selectedSkillNo = Number(event.target.value);
    console.log("Seçilen Yetenek No:", this.selectedSkillNo);
  }

  selectAvatar(avatar:string){
    this.userModel.avatar = avatar;
  }

  logout(){
    localStorage.setItem("token", "");
  }
}
