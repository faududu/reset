// Journal da aula M1·5 "Um, uma" (a / an). Conteúdo tirado do vídeo (transcrição Eyes) + vocabulário extra.
// Regra da casa: inglês sempre com o português colado; gramática escondida (o aluno descobre o padrão).
window.AULA = {
  id: "m1-5",
  modulo: "M1",
  numero: 5,
  titulo: "Um, uma",
  tituloEn: "a / an",
  minutos: 8,
  frase: "Nessa aula você aprendeu a dizer um, uma em inglês.",

  // 01 · O padrão (do jeito do vídeo: duas listas, o aluno repara)
  grupoA: [
    { en: "a dog", pt: "um cachorro", img: "dog", audio: "a-dog" },
    { en: "a book", pt: "um livro", img: "closed_book", audio: "a-book" },
    { en: "a car", pt: "um carro", img: "automobile", audio: "a-car" },
    { en: "a table", pt: "uma mesa", img: "table", audio: "a-table" },
    { en: "a phone", pt: "um celular", img: "mobile_phone", audio: "a-phone" }
  ],
  grupoAn: [
    { en: "an apple", pt: "uma maçã", img: "red_apple", audio: "an-apple" },
    { en: "an orange", pt: "uma laranja", img: "tangerine", audio: "an-orange" },
    { en: "an egg", pt: "um ovo", img: "egg", audio: "an-egg" },
    { en: "an idea", pt: "uma ideia", img: "light_bulb", audio: "an-idea" },
    { en: "an umbrella", pt: "um guarda-chuva", img: "umbrella", audio: "an-umbrella" }
  ],
  descoberta: {
    pergunta: "Repararam o padrão? O que as palavras do grupo AN têm em comum?",
    opcoes: ["São todas comidas", "Começam com vogal (a, e, i, o, u)", "São palavras compridas"],
    certa: 1,
    revela: "Começou com <b>som de vogal</b> → <b>AN</b>. Qualquer outro som → <b>A</b>. That's it!"
  },
  excecoes: [
    { en: "an hour", pt: "uma hora", img: "alarm_clock", audio: "an-hour", porque: "o H não tem som: soa “áuer”" },
    { en: "a university", pt: "uma universidade", img: "classical_building", audio: "a-university", porque: "soa “iú”, que não é som de vogal" }
  ],
  excecaoNota: "São raríssimas. 99% das palavras seguem o padrão, e eu sempre aviso quando aparecer uma dessas.",

  // 02 · Vocabulário extra (o desafio usa ele também, pra não repetir só o do vídeo)
  extra: [
    { en: "a cat", pt: "um gato", img: "cat", audio: "a-cat" },
    { en: "a house", pt: "uma casa", img: "house", audio: "a-house" },
    { en: "a key", pt: "uma chave", img: "key", audio: "a-key" },
    { en: "a pizza", pt: "uma pizza", img: "pizza", audio: "a-pizza" },
    { en: "a guitar", pt: "um violão", img: "guitar", audio: "a-guitar" },
    { en: "an elephant", pt: "um elefante", img: "elephant", audio: "an-elephant" },
    { en: "an ice cream", pt: "um sorvete", img: "soft_ice_cream", audio: "an-ice-cream" },
    { en: "an eye", pt: "um olho", img: "eye", audio: "an-eye" },
    { en: "an onion", pt: "uma cebola", img: "onion", audio: "an-onion" },
    { en: "an airplane", pt: "um avião", img: "airplane", audio: "an-airplane" },
    { en: "an octopus", pt: "um polvo", img: "octopus", audio: "an-octopus" }
  ],

  // 03 · Desafio rápido
  escolha: [
    { palavra: "phone", pt: "um celular", img: "mobile_phone", certa: "a", audio: "a-phone", why: "“phone” começa com som de F, consoante → <b>a</b> phone." },
    { palavra: "egg", pt: "um ovo", img: "egg", certa: "an", audio: "an-egg", why: "“egg” começa com E, vogal → <b>an</b> egg." },
    { palavra: "elephant", pt: "um elefante", img: "elephant", certa: "an", audio: "an-elephant", why: "“elephant” começa com E, vogal → <b>an</b> elephant." },
    { palavra: "cat", pt: "um gato", img: "cat", certa: "a", audio: "a-cat", why: "“cat” começa com som de K, consoante → <b>a</b> cat." },
    { palavra: "hour", pt: "uma hora", img: "alarm_clock", certa: "an", audio: "an-hour", why: "Pegadinha! O H de “hour” não tem som (“áuer”) → <b>an</b> hour." },
    { palavra: "idea", pt: "uma ideia", img: "light_bulb", certa: "an", audio: "an-idea", why: "“idea” começa com I, vogal → <b>an</b> idea." },
    { palavra: "house", pt: "uma casa", img: "house", certa: "a", audio: "a-house", why: "Aqui o H tem som (“ráus”), é consoante → <b>a</b> house." },
    { palavra: "university", pt: "uma universidade", img: "classical_building", certa: "a", audio: "a-university", why: "Pegadinha! “university” soa “iú”, não é som de vogal → <b>a</b> university." }
  ],
  verdadeiroFalso: [
    { pt: "um sorvete", en: "a ice cream", certo: false, fix: "an ice cream", img: "soft_ice_cream", audio: "an-ice-cream", why: "“ice” começa com I, vogal. O certo é <b>an</b> ice cream." },
    { pt: "uma chave", en: "a key", certo: true, img: "key", audio: "a-key", why: "“key” começa com som de K, consoante → <b>a</b> key. True!" },
    { pt: "um polvo", en: "a octopus", certo: false, fix: "an octopus", img: "octopus", audio: "an-octopus", why: "“octopus” começa com O, vogal. O certo é <b>an</b> octopus." },
    { pt: "um violão", en: "a guitar", certo: true, img: "guitar", audio: "a-guitar", why: "“guitar” começa com G, consoante → <b>a</b> guitar. True!" },
    { pt: "um olho", en: "an eye", certo: true, img: "eye", audio: "an-eye", why: "“eye” começa com E, vogal → <b>an</b> eye. True!" }
  ],
  erro: [
    { palavras: ["I", "have", "a", "umbrella."], errada: 2, fix: "an", pt: "Eu tenho um guarda-chuva.", audio: "f-umbrella", why: "“umbrella” começa com U, vogal → <b>an</b> umbrella." },
    { palavras: ["It's", "an", "car."], errada: 1, fix: "a", pt: "É um carro.", audio: "f-car", why: "“car” começa com C, consoante → <b>a</b> car." },
    { palavras: ["This", "is", "an", "university."], errada: 2, fix: "a", pt: "Isso é uma universidade.", audio: "f-university", why: "Exceção: “university” soa “iú” → <b>a</b> university." },
    { palavras: ["I", "need", "a", "hour."], errada: 2, fix: "an", pt: "Eu preciso de uma hora.", audio: "f-hour", why: "Exceção: o H de “hour” não tem som → <b>an</b> hour." }
  ],

  // 04 · Fala aí
  fala: [
    { en: "I have an umbrella.", pt: "Eu tenho um guarda-chuva.", audio: "f-umbrella", alvo: "an umbrella", errado: "a umbrella", img: "umbrella" },
    { en: "It's an egg.", pt: "É um ovo.", audio: "f-egg", alvo: "an egg", errado: "a egg", img: "egg" },
    { en: "I have a phone.", pt: "Eu tenho um celular.", audio: "f-phone", alvo: "a phone", errado: "an phone", img: "mobile_phone" },
    { en: "I have an idea!", pt: "Eu tenho uma ideia!", audio: "f-idea", alvo: "an idea", errado: "a idea", img: "light_bulb" }
  ],

  proxima: { titulo: "M1·6 · Possessivos", pt: "my, your, his, her…" }
};
