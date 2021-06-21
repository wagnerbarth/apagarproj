import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// adicionar módulos
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  usuario: string; // global
  sql: string;
  title: string;
  results: any[] = [];
  // results = new Array():

  constructor(
    private sqLite: SQLite,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // receber parâmetros da página login
    this.usuario = this.activatedRoute.snapshot.paramMap.get('usuario');
    this.listarTodos();
  }

  listarTodos() {
    // limpar o array results
    this.results = [];

    // abrir o BD
    this.sqLite.create({
      name: 'turmaB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        // pesquisar no banco de dados para exibir
        // se o usuário for 'admin' lista todos
        if (this.usuario === 'admin') {
          this.title = 'Usuarios';
          this.sql = 'SELECT * FROM usuarios';
        } else {
          this.title = `Usuario logado: ${this.usuario}`;
          this.sql = `SELECT * FROM usuarios WHERE usuario='${this.usuario}'`;
          // this.sql = 'SELECT * FROM usuarios WHERE usuario="'+this.usuario+'"';
        }

        db.executeSql(this.sql, [])
          .then((result) => {
            // alert(JSON.stringify(result)); // debug
            for (let i = 0; i < result.rows.length; i++) {
              const item = result.rows.item(i);
              console.log('Item: ', item);
              // colocar dentro do array results
              this.results.push(item);
            }
          })
          .catch(() => {
            alert('Erro ao pesquisar/listar');
          });
      })
      .catch(() => {
        alert('Erro ao abrir DB no Listar');
      });
  }


  // prompt de atualização de dados
  async promptAtualizar(campo: string, data: string, item: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `Atualizar usuário: ${item.usuario}`,
      inputs: [
        {
          name: 'data',
          type: 'text',
          placeholder: `${campo}: ${data}`
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: (result) => {
            console.log('Confirm Ok', result);
            this.atualizarUsuario(campo, result.data, item);
          }
        }
      ]
    });

    await alert.present();
  }

  // método para atualizar os dados do usuário
  atualizarUsuario(campo: string, data: string, item: any) {

    if (data !== '') {
      alert('Campo: ' + campo + ' Dado: ' + data + ' ID:' + item.id);

      // procedimento de atualização de dados
      this.sqLite.create({ // serve tanto para criar quanto para abrir a base de dados
        name: 'turmaB.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          const sql = `UPDATE usuarios SET ${campo} = '${data}' WHERE id = '${item.id}'`;

          // executar o query
          db.executeSql(sql, [])
            .then((result) => {
              alert('Usuário alterado com sucesso! Id do usuario: ');
              this.listarTodos();
            })
            .catch(() => { alert('ERRO!!! - Não foi possivel alterar o usuario!'); });
        })
        .catch((error) => {
          alert(error);
        });

    }
  }
}
