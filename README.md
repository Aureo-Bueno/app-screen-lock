# App Screen Lock

Aplicativo Expo com bloqueio de tela por inatividade, autenticação biométrica e PIN.

## Funcionalidades

- **Bloqueio por inatividade**: após `N` segundos sem interação, o app é bloqueado automaticamente
- **Autenticação biométrica**: suporte a fingerprint/facial via `expo-local-authentication`
- **Fallback por PIN**: se a biometria falhar ou não estiver disponível, usa PIN de 6 dígitos
- **Bloqueio ao sair do app**: trava automaticamente ao voltar de background
- **Tempo configurável por tela**: cada tela pode definir seu próprio timeout
- **Telas públicas vs sensíveis**: telas sem autenticação e telas protegidas

## Estrutura

```
src/
├── @types/
│   └── navigation.d.ts        # Tipos das rotas de navegação
├── contexts/
│   └── AuthContext.tsx          # Estado global de autenticação e sessão
├── hooks/
│   └── useScreendGuard.ts      # Hook de proteção por tela
├── routes/
│   ├── index.tsx               # NavigationContainer
│   └── app.routes.tsx          # Definição das rotas (Home, Dashboard)
├── screens/
│   ├── Home.tsx                # Tela pública
│   ├── Dashboard.tsx           # Tela sensível (requer autenticação)
│   └── LockScreen.tsx          # Overlay de bloqueio com PIN + biometria
```

## Fluxo

1. O app inicia na tela `Home` (pública, sem autenticação)
2. Ao navegar para `Dashboard`, o timer de sessão é reiniciado
3. Após o timeout configurado (padrão: 10s), o app é bloqueado
4. O bloqueio também ocorre ao minimizar o app (background)
5. A `LockScreen` é exibida como overlay sobre qualquer tela
6. O usuário desbloqueia com PIN ou biometria

## Tecnologias

| Biblioteca                       | Versão   | Finalidade                   |
| -------------------------------- | -------- | ---------------------------- |
| `expo`                           | ~54.0.35 | Framework                    |
| `react-native`                   | 0.81.5   | Runtime                      |
| `expo-local-authentication`      | ~17.0.8  | Biometria (fingerprint/face) |
| `expo-secure-store`              | SDK 54   | Armazenamento seguro do PIN  |
| `@react-navigation/native`       | ^7.3.5   | Navegação                    |
| `@react-navigation/native-stack` | ^7.17.7  | Stack navigator              |
| `react-native-screens`           | ~4.16.0  | Telas nativas otimizadas     |
| `react-native-safe-area-context` | ~5.6.0   | Safe area                    |

## Scripts

```bash
npm start          # Inicia o Metro bundler
npm run android    # Inicia no Android
npm run ios        # Inicia no iOS
npm run web        # Inicia no navegador
```

## Configuração

O timeout de bloqueio pode ser ajustado por tela no `useScreenGuard`:

```ts
// Dashboard: trava após 30s de inatividade
useScreenGuard("Dashboard", { required: true, timeout: 30 });
```

O PIN é solicitado na primeira vez que o app é bloqueado e fica armazenado de forma segura.
