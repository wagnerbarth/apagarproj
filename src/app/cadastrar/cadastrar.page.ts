import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {

  usuario: string;
  email: string;
  senha: string;

  constructor(
    private sqLite: SQLite
  ) { }

  ngOnInit() {
  }

  cadastrar(usuario: string, email: string, senha: string) {

    this.sqLite.create({ // serve tanto para criar quanto para abrir a base de dados
      name: 'turmaB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        const sql = 'INSERT INTO usuarios (usuario, email, senha) VALUES (?,?,?)';

        // preparar os dados a serem inseridos
        const dadosUsuario = [
          usuario,
          email,
          senha
        ];

        // executar o query
        db.executeSql(sql, dadosUsuario)
          .then((result) => { alert('Usuário cadastrado com sucesso! Id do usuario: ' + result.insertId); })
          .catch(() => { alert('ERRO!!! - Usuário ou email já existem tente outros!'); });
      })
      .catch((error) => {
        alert(error);
      });
  }

}
