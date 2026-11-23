// MISSÃO DA SEMANA 01 (23–29/11/2026) · revisão do Módulo 1 numa fofoca (Steve e Laura vêm da aula M1·6 "Let's gossip!").
// Só usa o que o aluno já viu: to be (am/is/are), contração (I'm, she's, they're), a / an, possessivos (his, her, their).
window.AULA = {
  id: "missao-01",
  ehMissao: true,
  tag: "MISSÃO DA SEMANA · 01",
  see: "See you next week! 👋 <i>(Te vejo semana que vem!)</i>",
  modulo: "MISSÃO",
  numero: "01",
  titulo: "Let's gossip!",
  tituloEn: "Bora fofocar!",
  minutos: 5,
  capaSub: "Tudo do Módulo 1 numa fofoca só: <b>to be</b>, contração, <b>a / an</b> e possessivos. <i>(Your mission this week!)</i>",
  tituloVocab: "Quem é quem",
  leadVocab: "Lembra do Steve e da Laura? Toca pra ouvir a fofoca. <i>(Meet Steve and Laura.)</i>",
  extra: [
    { en: "Steve is rich.", pt: "O Steve é rico.", img: "money_bag", audio: "m-steve-rich" },
    { en: "Steve is an artist.", pt: "O Steve é artista.", img: "artist_palette", audio: "m-steve-artist" },
    { en: "His car is red.", pt: "O carro dele é vermelho.", img: "automobile", audio: "m-his-car" },
    { en: "Laura is a doctor.", pt: "A Laura é médica.", img: "woman_health_worker", audio: "m-laura-doctor" },
    { en: "Her dog is crazy.", pt: "O cachorro dela é doido.", img: "dog", audio: "m-her-dog" },
    { en: "They're together!", pt: "Eles estão juntos!", img: "smiling_face_with_hearts", audio: "m-together" }
  ],
  titEscolha: "complete a fofoca",
  escolha: [
    { frase: "Laura ___ a doctor.", opcoes: ["is", "are"], certa: "is", pt: "A Laura é médica.", img: "woman_health_worker", audio: "m-laura-doctor", why: "Laura = she (uma pessoa só) → <b>is</b>." },
    { frase: "Steve is ___ artist.", opcoes: ["a", "an"], certa: "an", pt: "O Steve é artista.", img: "artist_palette", audio: "m-steve-artist", why: "“artist” começa com A, vogal → <b>an</b> artist." },
    { frase: "Steve is rich. ___ car is red.", opcoes: ["His", "Her"], certa: "His", pt: "O Steve é rico. O carro dele é vermelho.", img: "automobile", audio: "m-steve-car", why: "O dono é o Steve (ele) → <b>his</b>." },
    { frase: "Laura is a doctor. ___ dog is crazy.", opcoes: ["His", "Her"], certa: "Her", pt: "A Laura é médica. O cachorro dela é doido.", img: "dog", audio: "m-laura-dog", why: "A dona é a Laura (ela) → <b>her</b>." },
    { frase: "Steve and Laura ___ together.", opcoes: ["is", "are"], certa: "are", pt: "O Steve e a Laura estão juntos.", img: "smiling_face_with_hearts", audio: "m-steve-laura", why: "Steve + Laura = they (dois) → <b>are</b>." },
    { frase: "They're rich! ___ house is big.", opcoes: ["Their", "His"], certa: "Their", pt: "Eles são ricos! A casa deles é grande.", img: "house", audio: "m-their-house", why: "Os donos são os dois (eles) → <b>their</b>." },
    { frase: "___ a student.", opcoes: ["I'm", "I is"], certa: "I'm", pt: "Eu sou estudante.", img: "student", audio: "m-student", why: "I + am = <b>I'm</b>. “I is” não existe." },
    { frase: "She is happy. → ___ happy.", opcoes: ["She's", "She'm"], certa: "She's", pt: "Ela está feliz.", img: "grinning_face_with_big_eyes", audio: "m-shes-happy", why: "she + is = <b>she's</b>." }
  ],
  verdadeiroFalso: [
    { pt: "dele", en: "his", certo: true, why: "<b>his</b> = dele. (E <b>her</b> = dela.)" },
    { pt: "dela", en: "his", certo: false, fix: "her", why: "dela = <b>her</b>. (his = dele.)" },
    { pt: "eles estão", en: "they're", certo: true, why: "they are = <b>they're</b>." }
  ],
  erro: [
    { palavras: ["Laura", "is", "a", "engineer."], errada: 2, fix: "an", pt: "A Laura é engenheira.", audio: "m-x-engineer", why: "“engineer” começa com E, vogal → <b>an</b> engineer." },
    { palavras: ["Steve", "and", "Laura", "is", "together."], errada: 3, fix: "are", pt: "O Steve e a Laura estão juntos.", audio: "m-steve-laura", why: "Dois = they → <b>are</b>." },
    { palavras: ["Laura", "is", "happy.", "His", "dog", "is", "here."], errada: 3, fix: "Her", pt: "A Laura está feliz. O cachorro dela está aqui.", audio: "m-x-herdog", why: "O cachorro é da Laura (dela) → <b>her</b>." },
    { palavras: ["I", "is", "a", "student."], errada: 1, fix: "am", pt: "Eu sou estudante.", audio: "m-x-student", why: "I + <b>am</b>. Sempre." }
  ],
  fala: [
    { en: "Steve is rich.", pt: "O Steve é rico.", audio: "m-steve-rich", alvo: ["steve is rich", "steve's rich"], errado: ["steve are rich"], img: "money_bag" },
    { en: "Her dog is crazy.", pt: "O cachorro dela é doido.", audio: "m-her-dog", alvo: ["her dog is crazy", "her dog's crazy"], errado: ["his dog is crazy"], img: "dog" },
    { en: "They're together!", pt: "Eles estão juntos!", audio: "m-together", alvo: ["they're together", "they are together", "their together", "there together"], errado: ["they is together"], img: "smiling_face_with_hearts" },
    { en: "I'm a student.", pt: "Eu sou estudante.", audio: "m-student", alvo: ["i'm a student", "i am a student"], errado: ["i'm an student", "i is a student"], img: "student" }
  ],
  fimTitulo: "Mission complete!",
  fimPt: "(Missão cumprida!)",
  fimTop: "Excellent! O Módulo 1 tá no sangue.",
  fimExtra: "🎤 <b>Bônus (se quiser):</b> manda no grupo VIP um áudio de 3 frases sobre você: <i>I'm… · I'm a / an… · My … is …</i>"
};
