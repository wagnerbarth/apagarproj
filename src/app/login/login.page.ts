import { Component, OnInit } from '@angular/core';
// sqlite
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variáveis
  usuario: string;
  senha: string;

  constructor(
    private sqLite: SQLite
  ) {
    // inicialização de variáveis
    this.usuario = 'admin';
    this.senha = '123456';
  }

  ngOnInit() {
    this.criarBD(); // ao iniciar o ciclo de vida da aplicação
  }

  // método para criar o banco de dados
  // usaremos o método sqlite.create()
  // mo método create() serve para criar e abrir um BD
  criarBD() {
    this.sqLite.create({
      name: 'login.db', // cria Database ou abre se já existe
      location: 'default'
    })
      .then((db: SQLiteObject) => { // o objto db permite a execução da query

        db.executeSql('DROP TABLE usuarios', []).then(() => { alert('ok'); });


        // constante sql que contém a query para crar uma tabela
        const sql = 'CREATE TABLE IF NOT EXISTS usuarios(' +
          'id INTEGER PRIMARY KEY,' +
          'usuario TEXT UNIQUE NOT NULL,' +
          'email TEXT UNIQUE NOT NULL,' +
          'senha TEXT NOT NULL)';

        // executando a query de criação de tabela
        db.executeSql(sql, [])
          .then(() => {
            alert('Tabela usuarios ok!'); // sempre será executado ao abrir a aplicação

            // inserir usuario padrão admin somente se ele não existir
            const sqlSelect = 'SELECT * FROM usuarios WHERE usuario = "admin"';

            db.executeSql(sqlSelect, []) // executo a query que testa se existe usuario admin
              .then((result) => {  // se existe o usuario admin retorna 1 registro e não insere
                if (result.rows.lenght < 1) {
                  // inserir o usuario padrão admin de login
                  const sqlInsert = 'INSERT INTO usuarios ("usuario", "email", "senha") VALUES (?,?,?)';

                  // config dos dados a serem inseridos na tabela
                  const dadosUsuario = ['admin', 'admin@admin.com', '123456'];

                  // usando array de dados para a query
                  db.executeSql(sqlInsert, dadosUsuario).then(() => { alert('Usuario admin OK!'); });
                }
              });
          })
          .catch(() => {
            alert('Tabela usuarios erro!');
          });
      })
      .catch((err) => {
        alert('Erro ao criar Database cadastro!');
      });
  }

  /*-----------------------------
  * Método que realiza o login da aplicação
  ------------------------------*/
  login(usuario: string, senha: string) {
    // alert(usuario + ' ' + senha); debug

    const dadosUsuario = [
      usuario,
      senha
    ];

    // abrir o banco de dados
    this.sqLite.create({
      name: 'login.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        // query de consulta de usuario
        const sql = 'SELECT * FROM usuarios WHERE usuario=? AND senha=?';

        db.executeSql(sql, dadosUsuario)
          .then((result) => {
            console.log('Login OK', result);
          })
          .catch((erro) => {
            console.log('Login Error', erro);
          });
      })
      .catch();
  }
}
