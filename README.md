# BodyBalance

App mobile (Expo / React Native) de bem-estar. A partir de fotos e de dados simples, ele calcula um **score de condição corporal** e gera um **plano de dieta e treino** para chegar à meta no prazo escolhido. Quando o prazo não é seguro, o app oferece a opção viável mais próxima.

- **Sem IA e sem servidor.** Tudo é calculado no aparelho, com equações da literatura.
- **Privado.** Fotos e dados ficam só no dispositivo (AsyncStorage + diretório do app).

## Como rodar

```bash
npm install
npm run web       # navegador
npm start         # QR code para o Expo Go (Android/iOS)
npm test          # testes do motor de cálculo
npm run typecheck
npm run lint
```

## Fluxo

1. **Boas-vindas**, com aviso de que o app é educativo (18+, não gestante).
2. **Dados básicos:** sexo, idade, altura e peso.
3. **Fotos:** frente (obrigatória), lado e costas.
4. **Silhueta:** autoavaliação numa escala de 9 figuras (estilo Stunkard).
5. **Cintura** (opcional, com tutorial).
6. **Rotina:** atividade, dias de treino, local, experiência e restrições.
7. **Meta + prazo:** definir (Saudável/Fitness/Atlético), ganhar massa (+2/4/6 kg) ou manter, em 1, 3, 6 ou 12 meses.
8. **Resultado:** score, composição corporal e meta viável ou ajustada.

Depois do onboarding, o app tem cinco abas:
- **Início:** resumo do dia.
- **Dieta:** macros e cardápio A/B com trocas.
- **Treino:** divisão semanal, séries e execução.
- **Progresso:** check-in de peso, que recalcula o plano, e fotos de antes e agora.
- **Ajustes:** dados, referências científicas e opção de apagar tudo.

## Motor de cálculo (`src/engine`)

| Etapa | Método |
|---|---|
| % de gordura com cintura | Relative Fat Mass (Woolcott & Bergman, 2018) |
| % de gordura sem cintura | Deurenberg (1991) 70% + silhueta 30% |
| Score 0–100 | %G frente às faixas do ACE (80%) + relação cintura/estatura (20%) |
| Viabilidade da meta | perda de 0,25–1%/semana (Helms 2014; ACSM), ganho de 0,1–0,4%/semana conforme experiência |
| Calorias | Mifflin-St Jeor × fator de atividade, déficit ≤ 25%, piso de 1200/1500 kcal |
| Macros | proteína 1,6–2,0 g/kg (ISSN), gordura ≥ 20% das kcal, carboidrato no restante |
| Cardápio | templates com alimentos brasileiros; porções resolvidas por mínimos quadrados |
| Treino | divisão por dias (full body, superiores/inferiores, empurrar/puxar/pernas), dose ACSM por nível, casa ou academia |

## Estrutura

```
src/
  app/          rotas (expo-router): onboarding/ e (tabs)/
  components/   UI, ScoreRing, Silhouette, PhotoSlot, WeightChart, Icon
  engine/       cálculos puros + testes
  data/         alimentos, refeições, exercícios
  store/        estado persistente (zustand) e plano derivado
  lib/          fotos e formatação
  theme/        paleta clara/escura e tipografia (Fraunces + Inter)
```

> O BodyBalance oferece estimativas educativas e não substitui nutricionista, educador físico ou médico.
