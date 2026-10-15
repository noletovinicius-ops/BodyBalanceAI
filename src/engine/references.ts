export interface Reference {
  topic: string;
  text: string;
  citation: string;
}

export const REFERENCES: Reference[] = [
  {
    topic: 'Gordura corporal com cintura',
    text: 'Quando você informa a cintura, estimamos o % de gordura pela Relative Fat Mass (RFM), que usa só altura e cintura e foi validada contra DEXA.',
    citation: 'Woolcott OO, Bergman RN. Sci Rep. 2018;8:10980.',
  },
  {
    topic: 'Gordura corporal sem cintura',
    text: 'Sem a cintura, usamos a equação de Deurenberg (IMC, idade e sexo), ajustada pela silhueta que você escolheu.',
    citation: 'Deurenberg P et al. Br J Nutr. 1991;65:105–114. Stunkard AJ et al. 1983 (escala de silhuetas).',
  },
  {
    topic: 'Relação cintura/estatura',
    text: 'Manter a cintura abaixo da metade da altura (relação < 0,5) é um indicador simples de menor risco cardiometabólico.',
    citation: 'Ashwell M, Hsieh SD. Int J Food Sci Nutr. 2005;56:303–307.',
  },
  {
    topic: 'Categorias de gordura',
    text: 'As faixas Atlético, Fitness e Saudável seguem as categorias de % de gordura do American Council on Exercise.',
    citation: 'American Council on Exercise (ACE). Percent Body Fat Norms.',
  },
  {
    topic: 'Ritmo seguro de perda',
    text: 'Perder entre 0,5% e 1% do peso por semana ajuda a preservar a massa muscular. Prazos mais curtos que isso são ajustados.',
    citation: 'Helms ER et al. JISSN. 2014;11:20. ACSM Position Stand, 2009.',
  },
  {
    topic: 'Ganho de massa',
    text: 'Iniciantes ganham cerca de 0,25–0,5% do peso por semana em massa magra; o ritmo cai com a experiência.',
    citation: 'Aragon AA et al. JISSN. 2017;14:16 (ISSN Position Stand: diets and body composition).',
  },
  {
    topic: 'Calorias',
    text: 'O gasto diário é estimado pela equação de Mifflin-St Jeor multiplicada pelo seu nível de atividade.',
    citation: 'Mifflin MD et al. Am J Clin Nutr. 1990;51:241–247.',
  },
  {
    topic: 'Proteína',
    text: 'Consumir 1,6–2,2 g de proteína por kg por dia favorece a massa muscular, sobretudo em déficit calórico.',
    citation: 'Jäger R et al. JISSN. 2017;14:20 (ISSN Position Stand: protein and exercise).',
  },
  {
    topic: 'Treino de força',
    text: 'Séries, repetições e descanso seguem a progressão recomendada pelo ACSM para iniciantes, intermediários e avançados.',
    citation: 'ACSM. Progression models in resistance training for healthy adults. MSSE. 2009;41:687–708.',
  },
];
