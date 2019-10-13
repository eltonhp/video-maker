# video-maker
Projeto open source para fazer vídeos automatizados



## Watson Natural Language Understanding

File: `watson-nlu.json`

````
{
  "apikey": "lnMKGqwIv7QUAgAFW-9mD7TvxGdP5E0KnuVZEHOAsNmu",
  "iam_apikey_description": "Auto-generated for key c6c35843-d942-4afa-993a-08883109c535",
  "iam_apikey_name": "Auto-generated service credentials",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/3de4c89ca738427c889af0108ddf9859::serviceid:ServiceId-d45a3f16-4a5f-43b6-ac17-33c445cfb724",
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api"
}
````

#### Sobre o Google Youtube API 
Quando se está configurado esta API o google pode 2 URLS 
quando escolhemos o servidor com oauth que são: 

1 - primeira url
    informa a origem de pedidos,
    no caso o nosso site


2 - segunda url de callback
    serve para o google avisar de volta com as credenciais caso o usuario authorize a requisição

