// Configuração do Firebase (Use a sua configuração correta!)
const firebaseConfig = {
    apiKey: "AIzaSyCPDNrDfpnE9E8OSKPGUb8Yfcw9U35grxw", // <<< SEU VALOR REAL AQUI
    authDomain: "estudar-c3bd8.firebaseapp.com", // <<< SEU VALOR REAL AQUI
    databaseURL: "https://estudar-c3bd8-default-rtdb.firebaseio.com", // <<< SEU VALOR REAL AQUI
    projectId: "estudar-c3bd8", // <<< SEU VALOR REAL AQUI
    storageBucket: "estudar-c3bd8.appspot.com", // <<< SEU VALOR REAL AQUI
    messagingSenderId: "99162327301", // <<< SEU VALOR REAL AQUI
    appId: "1:99162327301:web:b3aa8eade3ae8e01458f6c", // <<< SEU VALOR REAL AQUI
    measurementId: "G-YYCYX12L67" // <<< SEU VALOR REAL AQUI (Opcional)
};


// --- Inicialização Firebase ---
try {
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); console.log('Firebase inicializado'); }
    else { firebase.app(); console.log('Firebase já inicializado'); }
} catch (error) { console.error('Erro Firebase Init:', error); alert('Erro ao inicializar o Firebase. Verifique a configuração.'); }
const database = firebase.database();
const auth = firebase.auth();

// --- Elementos DOM (Autenticação) ---
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const authTitle = document.getElementById('auth-title');
const authErrorEl = document.getElementById('auth-error');
const toggleToRegister = document.getElementById('toggle-to-register');
const toggleToLogin = document.getElementById('toggle-to-login');
const logoutBtn = document.getElementById('logout-btn');
const userDisplayNameEl = document.getElementById('user-display-name');

// --- Elementos DOM (App Principal - Mantidos) ---
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerDisplay = document.getElementById('timer-display');
// const editTimerHint = document.getElementById('edit-timer-hint'); // Removido
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const todayTimeEl = document.getElementById('today-time');
const weekTimeEl = document.getElementById('week-time');
const pomodoroCountEl = document.getElementById('pomodoro-count');
// const usernameInput = document.getElementById('username-input'); // Removido, substituído por userDisplayNameEl
const userStatusDot = document.getElementById('user-status-dot');
const userStatusText = document.getElementById('user-status-text');
const focusMessage = document.getElementById('focus-message');
const progressRingCircle = document.querySelector('.progress-ring-circle');
const themeToggle = document.getElementById('theme-toggle');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section');
const notificationEl = document.getElementById('notification');
const notificationTitle = document.getElementById('notification-title');
const notificationMessage = document.getElementById('notification-message');
const notificationClose = document.querySelector('.notification-close');
const notificationSound = document.getElementById('notification-sound');
const studyChartEl = document.getElementById('study-chart');
const achievementsListEl = document.getElementById('achievements-list');
const yourCodeEl = document.getElementById('your-code');
const copyCodeBtn = document.getElementById('copy-code');
const friendCodeInput = document.getElementById('friend-code');
const addFriendBtn = document.getElementById('add-friend-btn');
const disconnectFriendBtn = document.getElementById('disconnect-friend-btn');
const focusTogetherBtn = document.getElementById('focus-together-btn');
const friendStatusCard = document.getElementById('friend-status-card');
const friendNameEl = document.getElementById('friend-name');
const friendCurrentStatus = document.getElementById('friend-current-status');
const friendTimer = document.getElementById('friend-timer');
const friendStatsPlaceholder = document.getElementById('friend-stats-placeholder');
const saveSettingsBtn = document.getElementById('save-settings');
const messageBtns = document.querySelectorAll('.message-btn');
const friendRequestsListEl = document.getElementById('friend-requests-list');
const friendProfileModal = document.getElementById('friend-profile-modal');
const closeProfileModalBtn = document.getElementById('close-profile-modal');
const removeFriendModalBtn = document.getElementById('remove-friend-modal-btn');
const modalFriendName = document.getElementById('modal-friend-name');
const modalFriendStatus = document.getElementById('modal-friend-status');
const modalFriendTimer = document.getElementById('modal-friend-timer');
const modalFriendTodayTime = document.getElementById('modal-friend-today-time');
const modalFriendPomodoros = document.getElementById('modal-friend-pomodoros');
const longBreakIntervalInput = document.getElementById('long-break-interval');
const autoStartTimersToggle = document.getElementById('auto-start-timers');

// --- Configurações Padrão (Serão carregadas do DB) ---
let settings = {
    pomodoro: 25, shortBreak: 5, longBreak: 15,
    longBreakInterval: 4, autoStartTimers: false,
    soundNotification: true, desktopNotification: true, friendNotification: true
};

// --- Estado do Timer ---
let timer = {
    minutes: settings.pomodoro, // Usa valor inicial das settings padrão
    seconds: 0,
    mode: 'pomodoro',
    isRunning: false,
    interval: null,
    pomodorosSinceLongBreak: 0, // Será carregado do DB
    startTime: null,
    totalTime: settings.pomodoro * 60 // Usa valor inicial
};

// --- Dados do Usuário e Amigo (Agora baseado em UID) ---
let currentUser = null; // Armazena o objeto do usuário autenticado do Firebase
let userData = { // Armazena dados do DB do usuário atual
    id: null, // Firebase UID
    name: 'Usuário',
    status: 'offline',
    timeRemaining: 0,
    studyTimeToday: 0,
    studyTimeWeek: 0,
    completedPomodoros: 0,
    connectionCode: null, // Gerado se não existir no DB
    friendId: null, // UID do amigo
    achievements: [],
    studyHistory: Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 })),
    lastVisitDate: null, // Data da última visita para zerar stats diários/semanais
    pomodorosSinceLongBreak: 0,
    lastUpdate: null
};
let friendData = { // Armazena dados do amigo do DB
    id: null, // Firebase UID do amigo
    name: 'Aguardando conexão...',
    status: 'offline',
    timeRemaining: 0,
    isRunning: false,
    studyTimeToday: 0,
    completedPomodoros: 0,
    lastUpdate: null
};

// --- Chart, Conquistas (Definições) ---
let studyTimeChart;
const defaultAchievements = [
    { id: 'first_pomodoro', name: '1º Pomodoro', desc: 'Complete 1 pomodoro', icon: 'fa-solid fa-medal', unlocked: false },
    { id: 'five_pomodoros', name: 'Produtivo', desc: 'Complete 5 pomodoros', icon: 'fa-solid fa-fire', unlocked: false },
    { id: 'one_hour', name: 'Focado', desc: 'Estude por 1 hora hoje', icon: 'fa-solid fa-hourglass-half', unlocked: false },
    { id: 'three_hours', name: 'Maratonista', desc: 'Estude por 3 horas hoje', icon: 'fa-solid fa-trophy', unlocked: false },
    { id: 'friend_connect', name: '+ Juntos', desc: 'Conecte-se a um amigo', icon: 'fa-solid fa-user-friends', unlocked: false },
    { id: 'focus_together', name: 'Foco em Dupla', desc: 'Inicie sessão conjunta', icon: 'fa-solid fa-users', unlocked: false }
];
let currentAchievements = []; // Será carregado do DB

// --- Referências Firebase (Serão definidas após login) ---
let userRef = null;
let friendRef = null;
let requestsRef = null;
let messagesRef = null;
let settingsRef = null; // Referência para configurações do usuário
let statsRef = null; // Referência para estatísticas do usuário
let achievementsRef = null; // Referência para conquistas do usuário
let stateRef = null; // Referência para estado (status, timer, etc.)

// --- Estado de Conexão com Amigo ---
let isConnectedToFriend = false;
let friendListenerActive = false;
let userListenerActive = false; // Para controlar o listener do próprio usuário
let requestsListenerActive = false;
let messagesListenerActive = false;
let settingsListenerActive = false;
let statsListenerActive = false;
let achievementsListenerActive = false;
let stateListenerActive = false;

// --- Listener de Estado de Autenticação ---
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Usuário logado:", user.uid);
        currentUser = user;
        userData.id = user.uid; // Define o UID
        authContainer.classList.add('hidden'); // Esconde tela de login
        appContent.classList.remove('hidden'); // Mostra app
        initializeUserData(user); // Inicia carregamento de dados e listeners
    } else {
        console.log("Nenhum usuário logado.");
        currentUser = null;
        userData.id = null;
        authContainer.classList.remove('hidden'); // Mostra tela de login
        appContent.classList.add('hidden'); // Esconde app
        cleanupFirebaseListeners(); // Remove listeners ao deslogar
        resetAppState(); // Reseta estado local
    }
});

// --- Funções de Autenticação ---
function showAuthError(message) {
    authErrorEl.textContent = message;
    authErrorEl.style.display = 'block';
}

function clearAuthError() {
    authErrorEl.textContent = '';
    authErrorEl.style.display = 'none';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthError();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Login bem-sucedido:", userCredential.user.uid);
            // onAuthStateChanged vai lidar com a UI
        })
        .catch((error) => {
            console.error("Erro de login:", error);
            showAuthError(getFirebaseAuthErrorMessage(error));
        });
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthError();
    const username = registerUsernameInput.value.trim();
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    if (!username) {
        showAuthError("Por favor, insira um nome de usuário.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Cadastro bem-sucedido:", user.uid);
            // Salva o nome de usuário inicial e outros dados padrão no DB
            const initialUserData = {
                name: username,
                connectionCode: generateConnectionCode(),
                friendId: null,
                lastVisitDate: new Date().toLocaleDateString(), // Define a data inicial
                // Adicione outros campos padrão se necessário
            };
            const initialSettings = settings; // Usa as settings padrão
            const initialStats = {
                studyTimeToday: 0,
                studyTimeWeek: 0,
                completedPomodoros: 0,
                studyHistory: Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 })),
                pomodorosSinceLongBreak: 0
            };
             const initialAchievements = defaultAchievements.map(a => a.id); // Salva apenas os IDs desbloqueados (nenhum inicialmente)

            database.ref(`users/${user.uid}/profile`).set(initialUserData)
                .then(() => database.ref(`users/${user.uid}/settings`).set(initialSettings))
                .then(() => database.ref(`users/${user.uid}/stats`).set(initialStats))
                .then(() => database.ref(`users/${user.uid}/achievements`).set(initialAchievements))
                .then(() => {
                     console.log("Dados iniciais salvos para:", user.uid);
                      // onAuthStateChanged vai lidar com a UI
                 })
                 .catch(dbError => {
                     console.error("Erro ao salvar dados iniciais:", dbError);
                     // Tentar limpar o usuário criado se falhar ao salvar dados? (Opcional)
                     showAuthError("Erro ao configurar conta. Tente fazer login.");
                 });
        })
        .catch((error) => {
            console.error("Erro de cadastro:", error);
            showAuthError(getFirebaseAuthErrorMessage(error));
        });
});

logoutBtn.addEventListener('click', () => {
    if (timer.isRunning) {
        pauseTimer(); // Pausa antes de sair
    }
    // Atualiza o status para offline ANTES de deslogar
    if (userRef) {
        userRef.child('state').update({ status: 'offline', isRunning: false, lastUpdate: firebase.database.ServerValue.TIMESTAMP })
            .then(() => {
                 console.log("Status offline definido antes do logout.");
                 return auth.signOut();
            })
            .then(() => {
                 console.log("Logout realizado.");
                  // onAuthStateChanged tratará o resto
             })
             .catch(error => {
                 console.error("Erro ao definir status offline ou ao deslogar:", error);
                  // Força o logout mesmo se o update falhar
                 auth.signOut().catch(e => console.error("Erro no logout forçado:", e));
             });
     } else {
         auth.signOut().catch(e => console.error("Erro no logout (sem userRef):", e));
     }
});


toggleToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    toggleToRegister.classList.add('hidden');
    toggleToLogin.classList.remove('hidden');
    authTitle.textContent = 'Cadastro';
    clearAuthError();
});

toggleToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    toggleToLogin.classList.add('hidden');
    toggleToRegister.classList.remove('hidden');
    authTitle.textContent = 'Login';
    clearAuthError();
});

function getFirebaseAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email': return 'Formato de email inválido.';
        case 'auth/user-disabled': return 'Este usuário foi desabilitado.';
        case 'auth/user-not-found': return 'Nenhuma conta encontrada com este email.';
        case 'auth/wrong-password': return 'Senha incorreta.';
        case 'auth/email-already-in-use': return 'Este email já está em uso.';
        case 'auth/weak-password': return 'Senha muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/operation-not-allowed': return 'Login por email/senha não habilitado.';
        default: return 'Ocorreu um erro. Tente novamente.';
    }
}

// --- Inicialização de Dados e Listeners do Usuário ---
async function initializeUserData(user) {
    console.log("Inicializando dados para:", user.uid);
    // Define referências principais
    userRef = database.ref(`users/${user.uid}`);
    settingsRef = userRef.child('settings');
    statsRef = userRef.child('stats');
    achievementsRef = userRef.child('achievements');
    stateRef = userRef.child('state'); // Nó para status, timer, etc.
    requestsRef = database.ref(`requests/${user.uid}`);

    // Configura onDisconnect primeiro
    stateRef.onDisconnect().update({ status: 'offline', isRunning: false, lastUpdate: firebase.database.ServerValue.TIMESTAMP })
        .catch(e => console.error("Erro OnDisconnect:", e));

    try {
        // 1. Carrega perfil (nome, código, amigo) - Apenas uma vez no login
        const profileSnap = await userRef.child('profile').once('value');
        if (profileSnap.exists()) {
            const profileData = profileSnap.val();
            userData.name = profileData.name || 'Usuário';
            userData.connectionCode = profileData.connectionCode || generateConnectionCode(); // Gera se não existir
            userData.friendId = profileData.friendId || null;
            userData.lastVisitDate = profileData.lastVisitDate || new Date().toLocaleDateString(); // Carrega ou define data atual
             console.log("Perfil carregado:", { name: userData.name, code: userData.connectionCode, friendId: userData.friendId, lastVisit: userData.lastVisitDate });
             // Salva código gerado ou data de visita se eram nulos
             const updates = {};
             if (!profileData.connectionCode) updates.connectionCode = userData.connectionCode;
             if (!profileData.lastVisitDate) updates.lastVisitDate = userData.lastVisitDate;
             if (Object.keys(updates).length > 0) {
                 userRef.child('profile').update(updates);
             }
        } else {
            console.warn("Nó 'profile' não encontrado. Criando com nome padrão e código.");
            userData.connectionCode = generateConnectionCode();
            userData.lastVisitDate = new Date().toLocaleDateString();
            userRef.child('profile').set({
                 name: userData.name,
                 connectionCode: userData.connectionCode,
                 friendId: null,
                 lastVisitDate: userData.lastVisitDate
             });
        }
        userDisplayNameEl.textContent = userData.name;
        displayConnectionCode();

        // Verifica se precisa resetar stats diários/semanais
        checkAndResetStats();


        // 2. Configura listeners para dados que mudam
        setupFirebaseListeners();

        // 3. Carrega dados iniciais de Settings, Stats, Achievements
        // Esses listeners (ativados em setupFirebaseListeners) farão o carregamento inicial
        // e manterão os dados atualizados.

        // 4. Configura UI inicial e outros elementos
        setupUI(); // Configura botões, menus, etc.
        initializeChart();
        requestNotificationPermission();
        updateStatusIndicator('online'); // Define status inicial como online na UI

        // 5. Atualiza o estado inicial no Firebase
        updateFirebaseUserState(true); // Atualiza status, timer (zerado), etc.

        console.log("Inicialização completa para:", user.uid);

    } catch (error) {
        console.error("Erro fatal ao inicializar dados:", error);
        showNotification("Erro Crítico", "Não foi possível carregar seus dados. Tente recarregar.", "error");
        // Forçar logout?
        auth.signOut();
    }
}

// --- Limpeza ao Deslogar ---
function cleanupFirebaseListeners() {
    console.log("Limpando listeners Firebase...");
    if (userRef) {
        // Remove onDisconnect explicitamente (embora deva ser feito pelo servidor)
         stateRef.onDisconnect().cancel().catch(e => console.warn("Warn ao cancelar onDisconnect:", e));
         // Remove todos os listeners do nó do usuário
         userRef.off();
         console.log("Listener userRef removido.");
     }
     if (friendRef) {
         friendRef.off();
         friendRef = null;
         console.log("Listener friendRef removido.");
     }
     if (requestsRef) {
         requestsRef.off();
         requestsRef = null;
          console.log("Listener requestsRef removido.");
     }
     if (messagesRef) {
         messagesRef.off();
         messagesRef = null;
         console.log("Listener messagesRef removido.");
     }
      // Reseta flags
     userListenerActive = false;
     friendListenerActive = false;
     requestsListenerActive = false;
     messagesListenerActive = false;
     settingsListenerActive = false;
     statsListenerActive = false;
     achievementsListenerActive = false;
     stateListenerActive = false;
     isConnectedToFriend = false;

     // Limpa refs
     userRef = null;
     settingsRef = null;
     statsRef = null;
     achievementsRef = null;
     stateRef = null;

     console.log("Listeners Firebase limpos.");
}

function resetAppState() {
     console.log("Resetando estado local do app...");
     // Reseta timer
     timer = {
         minutes: settings.pomodoro, seconds: 0, mode: 'pomodoro', isRunning: false,
         interval: null, pomodorosSinceLongBreak: 0, startTime: null, totalTime: settings.pomodoro * 60
     };
     if (timer.interval) clearInterval(timer.interval);
     updateTimerDisplay();
     updateProgressRing(1);
     startBtn.classList.remove('hidden');
     pauseBtn.classList.add('hidden');
     timerDisplay.classList.remove('timer-running');
     hideFocusMessage();

     // Reseta dados do usuário local
     userData = {
         id: null, name: 'Usuário', status: 'offline', timeRemaining: 0,
         studyTimeToday: 0, studyTimeWeek: 0, completedPomodoros: 0,
         connectionCode: null, friendId: null, achievements: [],
         studyHistory: Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 })),
         lastVisitDate: null, pomodorosSinceLongBreak: 0, lastUpdate: null
     };
     currentAchievements = [];

     // Reseta dados do amigo local
     friendData = {
         id: null, name: 'Aguardando conexão...', status: 'offline', timeRemaining: 0,
         isRunning: false, studyTimeToday: 0, completedPomodoros: 0, lastUpdate: null
     };
     resetFriendUI();

     // Reseta UI
     userDisplayNameEl.textContent = 'Carregando...';
     userStatusText.textContent = 'Offline';
     userStatusDot.className = 'status-dot offline';
     todayTimeEl.textContent = formatTime(0);
     weekTimeEl.textContent = formatTime(0);
     pomodoroCountEl.textContent = 0;
     if (studyTimeChart) {
         updateChart(userData.studyHistory); // Limpa o gráfico
     }
     renderAchievements(); // Limpa a lista de conquistas
     yourCodeEl.textContent = '...';
     friendRequestsListEl.innerHTML = '<li>Nenhum pedido pendente.</li>';
     disconnectFriendBtn.style.display = 'none';
     focusTogetherBtn.disabled = true;

      // Reseta configurações para o padrão na UI (não salva, será carregado no login)
     document.getElementById('pomodoro-time').value = settings.pomodoro;
     document.getElementById('short-break-time').value = settings.shortBreak;
     document.getElementById('long-break-time').value = settings.longBreak;
     longBreakIntervalInput.value = settings.longBreakInterval;
     autoStartTimersToggle.checked = settings.autoStartTimers;
     document.getElementById('sound-notification').checked = settings.soundNotification;
     document.getElementById('desktop-notification').checked = settings.desktopNotification;
     document.getElementById('friend-notification').checked = settings.friendNotification;

     console.log("Estado local resetado.");
}


// --- Funções de Setup UI (Mantidas e Adaptadas) ---
function setupUI() {
    console.log("Configurando UI...");
    // setupEditableTimer(); // Removido
    setupModeButtons();
    setupThemeToggle(); // Mantido (usa localStorage)
    setupMenuItems();
    setupNumberInputs(); // Mantido (inputs de settings)
    setupQuickMessages();
    setupEventListeners(); // Configura outros listeners de botões, etc.
}
// function setupEditableTimer() { ... } // Removida

// --- Funções Firebase Listeners (Reestruturadas) ---
function setupFirebaseListeners() {
    if (!currentUser || !userRef || !stateRef || !settingsRef || !statsRef || !achievementsRef || !requestsRef) {
        console.error("Referências Firebase essenciais não definidas para listeners!");
        return;
    }
    console.log("Configurando ouvintes Firebase para:", currentUser.uid);

    // Listener para estado (status, timer, isRunning)
    if (!stateListenerActive) {
         stateRef.on('value', handleUserStateChange, (error) => {
             console.error("Erro listener stateRef:", error);
             stateListenerActive = false;
             // Tentar reanexar? Ou notificar usuário?
         });
         stateListenerActive = true;
         console.log("Listener stateRef ativado.");
     }

    // Listener para configurações
    if (!settingsListenerActive) {
        settingsRef.on('value', handleSettingsChange, (error) => {
            console.error("Erro listener settingsRef:", error);
            settingsListenerActive = false;
        });
        settingsListenerActive = true;
         console.log("Listener settingsRef ativado.");
    }

     // Listener para estatísticas
     if (!statsListenerActive) {
         statsRef.on('value', handleStatsChange, (error) => {
             console.error("Erro listener statsRef:", error);
             statsListenerActive = false;
         });
         statsListenerActive = true;
          console.log("Listener statsRef ativado.");
     }

    // Listener para conquistas
    if (!achievementsListenerActive) {
        achievementsRef.on('value', handleAchievementsChange, (error) => {
             console.error("Erro listener achievementsRef:", error);
             achievementsListenerActive = false;
         });
         achievementsListenerActive = true;
          console.log("Listener achievementsRef ativado.");
     }

     // Listener para perfil (observa mudanças no friendId)
     if (!userListenerActive) {
         userRef.child('profile').on('value', handleProfileChange, (error) => {
             console.error("Erro listener profileRef:", error);
             userListenerActive = false;
         });
         userListenerActive = true;
         console.log("Listener profileRef ativado.");
     }

    // Listener para pedidos de amizade
    if (!requestsListenerActive) {
        requestsRef.on('value', handleFriendRequestsChange, (error) => {
            console.error("Erro listener requestsRef:", error);
            requestsListenerActive = false;
        });
        requestsListenerActive = true;
        console.log("Listener requestsRef ativado.");
    }

    // Listener de conexão geral do Firebase (mantido)
    database.ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === true) {
            console.log('Conectado ao Firebase RTDB.');
            // Se reconectar, atualiza o status para online (se não estiver rodando timer)
            if (currentUser && stateRef && !timer.isRunning) {
                stateRef.update({ status: 'online', lastUpdate: firebase.database.ServerValue.TIMESTAMP })
                    .catch(e => console.warn("Warn ao atualizar status online na reconexão:", e));
                // Atualiza UI local também
                 if (userData.status === 'offline') {
                     updateStatusIndicator('online');
                 }
            }
        } else {
            console.log('Desconectado do Firebase RTDB.');
            // A UI pode refletir offline se o onDisconnect funcionar,
            // mas podemos forçar aqui se desejado (cuidado com falso negativo)
            // if (currentUser && !timer.isRunning) {
            //     updateStatusIndicator('offline');
            // }
        }
    });

    console.log("Todos os listeners Firebase configurados.");
}

// --- Handlers para os Listeners ---

function handleUserStateChange(snapshot) {
    if (!stateListenerActive || !snapshot.exists()) {
        console.warn("State listener inativo ou snapshot nulo.");
        // Definir status como offline se não houver dados?
        if(!snapshot.exists() && currentUser) {
             stateRef.update({ status: 'offline', isRunning: false, timeRemaining: 0, currentMode: 'pomodoro', lastUpdate: firebase.database.ServerValue.TIMESTAMP });
        }
        return;
    }
    const stateData = snapshot.val();
     // Atualiza o status local apenas se o dado recebido for mais recente ou se for o primeiro load
     // e se não for o próprio timer rodando que causou a mudança (evita loop)
     if (!timer.isRunning && (stateData.lastUpdate > userData.lastUpdate || !userData.lastUpdate)) {
         console.log("Recebido state update:", stateData.status, stateData.isRunning);
         userData.status = stateData.status || 'offline';
         userData.timeRemaining = stateData.timeRemaining || 0;
         userData.lastUpdate = stateData.lastUpdate || Date.now();
         updateStatusIndicator(userData.status);

         // Se o estado remoto indica que o timer deveria estar rodando, mas não está localmente
         // (ex: abriu em outra aba e voltou), tentamos sincronizar? É complexo.
         // Por simplicidade, vamos apenas refletir o status.
     }
}

function handleSettingsChange(snapshot) {
     if (!settingsListenerActive) return;
     if (snapshot.exists()) {
         const loadedSettings = snapshot.val();
         settings = { ...settings, ...loadedSettings }; // Mescla com padrão
         console.log("Settings carregadas/atualizadas do DB:", settings);
         applySettingsToUI(); // Atualiza os inputs na UI
         // Se o timer não estiver rodando, atualiza o tempo exibido
         if (!timer.isRunning) {
             timer.minutes = settings[timer.mode];
             timer.seconds = 0;
             timer.totalTime = timer.minutes * 60;
             updateTimerDisplay();
             updateProgressRing(1);
         }
     } else {
         console.warn("Nó 'settings' não encontrado. Usando padrão e salvando.");
         saveSettingsToDB(); // Salva as settings padrão se não existirem
     }
}

function handleStatsChange(snapshot) {
     if (!statsListenerActive) return;
     if (snapshot.exists()) {
         const loadedStats = snapshot.val();
         console.log("Stats carregados/atualizados do DB");
         userData.studyTimeToday = loadedStats.studyTimeToday || 0;
         userData.studyTimeWeek = loadedStats.studyTimeWeek || 0;
         userData.completedPomodoros = loadedStats.completedPomodoros || 0;
         userData.studyHistory = loadedStats.studyHistory || Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 }));
         userData.pomodorosSinceLongBreak = loadedStats.pomodorosSinceLongBreak || 0;
         timer.pomodorosSinceLongBreak = userData.pomodorosSinceLongBreak; // Sincroniza com o timer local
         updateStatsUI(); // Atualiza a UI de estatísticas
         checkTimeAchievements(); // Verifica conquistas de tempo
         checkPomodoroAchievements(); // Verifica conquistas de pomodoros
     } else {
         console.warn("Nó 'stats' não encontrado. Usando padrão e salvando.");
         saveStatsToDB(); // Salva stats zerados se não existirem
     }
}

function handleAchievementsChange(snapshot) {
     if (!achievementsListenerActive) return;
     if (snapshot.exists()) {
         const unlockedIds = snapshot.val(); // Espera-se um array de IDs desbloqueados
         console.log("Achievements carregados/atualizados do DB:", unlockedIds);
         currentAchievements = defaultAchievements.map(ach => ({
             ...ach,
             unlocked: Array.isArray(unlockedIds) && unlockedIds.includes(ach.id)
         }));
         renderAchievements(); // Atualiza a UI
     } else {
         console.warn("Nó 'achievements' não encontrado. Usando padrão (nenhum desbloqueado).");
         currentAchievements = defaultAchievements.map(ach => ({ ...ach, unlocked: false }));
         renderAchievements();
          // Opcional: Salvar um array vazio no DB se ele não existir
         // saveAchievementsToDB([]);
     }
}

function handleProfileChange(snapshot) {
     if (!userListenerActive || !snapshot.exists()) {
          console.warn("Profile listener inativo ou snapshot nulo.");
          return;
     }
     const profileData = snapshot.val();
     const dbFriendId = profileData.friendId || null;

     // Atualiza nome local se mudou no DB (ex: editado em outro lugar)
     if (profileData.name && profileData.name !== userData.name) {
         userData.name = profileData.name;
         userDisplayNameEl.textContent = userData.name;
         console.log("Nome do usuário atualizado do DB:", userData.name);
     }

     // Atualiza código de conexão local se mudou no DB
      if (profileData.connectionCode && profileData.connectionCode !== userData.connectionCode) {
          userData.connectionCode = profileData.connectionCode;
          displayConnectionCode();
          console.log("Código de conexão atualizado do DB:", userData.connectionCode);
      }

     // Lógica de mudança de amigo
     if (dbFriendId !== userData.friendId) {
         console.log(`***** Mudança friendId (DB): ${userData.friendId} -> ${dbFriendId} *****`);
         userData.friendId = dbFriendId; // Atualiza friendId local
         disconnectFriendBtn.style.display = userData.friendId ? 'inline-block' : 'none'; // Atualiza botão

         if (userData.friendId) {
             // Se um novo friendId foi definido, configura o listener para ele
             setupFriendListener(userData.friendId);
             unlockAchievement('friend_connect'); // Desbloqueia conquista (se não estiver)
         } else {
             // Se friendId ficou nulo, desconecta localmente
             disconnectFriendLocal(); // Apenas limpa UI e listeners locais
         }
     }
     // Garante que o listener do amigo esteja ativo se tivermos um friendId
     else if (userData.friendId && !friendListenerActive) {
         console.log(`ProfileRef: friendId (${userData.friendId}) presente, reativando listener do amigo.`);
         setupFriendListener(userData.friendId);
         disconnectFriendBtn.style.display = 'inline-block';
     }
}

function handleFriendRequestsChange(snapshot) {
    if (!requestsListenerActive) return;
    const reqs = snapshot.val() || {};
     console.log("Dados de requests recebidos:", JSON.stringify(reqs)); // <-- ADICIONE ESTA LINHA
    renderFriendRequests(reqs);
}


// --- Listener do Amigo ---
// --- Listener do Amigo (MODIFICADO V2 - Tolerância Inicial) ---
function setupFriendListener(friendId) {
    if (!friendId) { console.warn("setupFriendListener ID nulo."); disconnectFriendLocal(); return; }
    if (friendListenerActive && friendRef && friendRef.key === friendId) { console.log(`Listener ${friendId} já ativo.`); return; }
    console.log(`%c Configurando listener para amigo: ${friendId}`, 'color: blue; font-weight: bold;');

    if (friendRef) friendRef.off();
    if (messagesRef) messagesRef.off();

    friendRef = database.ref(`users/${friendId}`);
    messagesRef = database.ref(`messages/${currentUser.uid}/${friendId}`);

    friendListenerActive = true;
    messagesListenerActive = true;

    // Zera estado anterior
    friendData.previousStatus = 'offline';
    friendData.previousIsRunning = false;

    // NOVO: Flag para controlar a primeira leitura do listener
    let isInitialFriendDataLoad = true;

    friendRef.on('value', (snapshot) => {
        if (!friendListenerActive || !friendRef || friendRef.key !== friendId) return;

        if (snapshot.exists()) {
            const friendFullData = snapshot.val();
            const friendProfile = friendFullData.profile || {};
            const friendState = friendFullData.state || {};
            const friendStats = friendFullData.stats || {};

            // MODIFICADO: Lógica de verificação de conexão mútua
            if (friendProfile.friendId !== currentUser.uid) {
                // SE NÃO for a primeira carga de dados E o amigo não aponta para nós, desconecta.
                if (!isInitialFriendDataLoad && userData.friendId === friendId) {
                    console.warn(`%c Amigo ${friendId} (${friendProfile.name}) não está mais conectado a nós! (Verificado após carga inicial)`, 'color: orange;');
                    showNotification("Desconectado", `${friendProfile.name || 'Amigo'} encerrou a conexão.`, "warning");
                    disconnectFriend(false); // Desconecta apenas localmente e no nosso DB
                } else if (isInitialFriendDataLoad) {
                    // É a primeira carga, pode ser apenas atraso na propagação. Loga um aviso mas não desconecta ainda.
                     console.warn(`%c Carga inicial: friendId do amigo (${friendId}) ainda não aponta para nós. Aguardando possível propagação...`, 'color: purple;');
                }
                // Se isInitialFriendDataLoad é false e userData.friendId !== friendId, já estamos desconectados, não faz nada.

                 // Mesmo que a conexão não esteja confirmada na primeira leitura,
                 // atualizamos os dados locais do amigo para exibição inicial.
                 // (Mas não consideramos 'isConnectedToFriend' como true ainda)
                 friendData.id = friendId;
                 friendData.name = friendProfile.name || 'Amigo';
                 // ... (poderia atualizar outros dados se desejado, mas talvez seja melhor esperar a confirmação)

                 // Importante: Reseta a flag após a primeira tentativa de leitura
                 isInitialFriendDataLoad = false;
                 return; // Sai mais cedo se a conexão não for mútua (ou ainda não confirmada)
            }

            // Se chegou aqui, a conexão é mútua (friendProfile.friendId === currentUser.uid)
            isConnectedToFriend = true; // Confirma a conexão
             console.log(`%c Conexão mútua com ${friendId} confirmada.`, 'color: green;');

            // Atualiza estado anterior ANTES de atualizar dados locais
            friendData.previousStatus = friendData.status;
            friendData.previousIsRunning = friendData.isRunning;

            // Atualiza dados locais do amigo
            friendData.id = friendId;
            friendData.name = friendProfile.name || 'Amigo';
            friendData.status = friendState.status || 'offline';
            friendData.timeRemaining = friendState.timeRemaining || 0;
            friendData.isRunning = friendState.isRunning || false;
            friendData.studyTimeToday = friendStats.studyTimeToday || 0;
            friendData.studyTimeWeek = friendStats.studyTimeWeek || 0;
            friendData.completedPomodoros = friendStats.completedPomodoros || 0;
            friendData.lastUpdate = friendState.lastUpdate || Date.now();

            const statusMudou = friendData.previousStatus !== friendData.status;
            const runningMudou = friendData.previousIsRunning !== friendData.isRunning;

            // Atualiza UI sempre que receber dados de amigo conectado
            updateFriendUI();

            // Notificação de Início de Estudo (apenas se não for a primeira carga)
            if (settings.friendNotification && !isInitialFriendDataLoad) {
                if (friendData.status === 'pomodoro' && friendData.isRunning &&
                    (friendData.previousStatus !== 'pomodoro' || !friendData.previousIsRunning))
                {
                    const friendName = friendData.name || 'Seu amigo';
                    showNotification('Amigo Iniciou!', `${friendName} começou a focar (Pomodoro)! 💪`, 'info');
                    if (settings.soundNotification) playSound(notificationSound);
                }
            }
            focusTogetherBtn.disabled = false; // Habilita botão de foco

            // Reseta a flag da carga inicial após o primeiro sucesso
            isInitialFriendDataLoad = false;

        } else {
            // Dados do amigo não existem mais
            console.warn(`%c Dados do amigo ${friendId} não encontrados no DB.`, 'color: orange;');
             // Reseta a flag da carga inicial
             isInitialFriendDataLoad = false;
            if (userData.friendId === friendId) {
                showNotification("Amigo Desconectado", "Os dados do amigo não foram encontrados.", "warning");
                disconnectFriend(false);
            }
        }
    }, (error) => {
        console.error(`%c Erro no listener do amigo ${friendId}:`, 'color: red;', error);
        friendListenerActive = false; // Reseta a flag da carga inicial
        isInitialFriendDataLoad = false;
        if (userData.friendId === friendId) {
             showNotification("Erro de Conexão", "Não foi possível obter dados do amigo.", "error");
             disconnectFriend(false);
        }
    });

    // Listener para mensagens recebidas DO amigo (sem mudanças aqui)
    messagesRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', (snapshot) => {
        /* ... (código idêntico ao anterior) ... */
         if (!messagesListenerActive || !isConnectedToFriend || !friendRef || friendRef.key !== friendId) {
              snapshot.ref.remove().catch(e => console.warn("Warn ao remover msg órfã:", e)); return;
         }
         const msg = snapshot.val();
         if (msg && msg.text && msg.senderId === friendId) {
              const senderName = msg.senderName || friendData.name || 'Amigo';
             if (msg.isFocusTogetherRequest) {
                  if (settings.soundNotification) playSound(notificationSound);
                  if (confirm(`🔥 ${senderName} convidou para uma sessão de estudo conjunta! Aceitar e iniciar Pomodoro?`)) {
                      setTimerMode('pomodoro'); startTimer();
                      showNotification("Sessão Iniciada", `Você aceitou o convite de ${senderName}!`, "success");
                  } else { showNotification("Convite Recusado", `Você recusou o convite de ${senderName}.`, "info"); }
              } else {
                  showNotification(`Mensagem de ${senderName}`, msg.text);
                  if (settings.soundNotification) playSound(notificationSound);
              }
             snapshot.ref.remove().catch(e => console.warn("Warn ao remover msg processada:", e));
         } else if (msg && msg.senderId !== friendId) {
              console.warn("Mensagem de remetente inesperado recebida, removendo:", msg.senderId);
              snapshot.ref.remove().catch(e => console.warn("Warn ao remover msg inesperada:", e));
         }
     }, (error) => {
          console.error(`%c Erro no listener de mensagens de ${friendId}:`, 'color: red;', error);
          messagesListenerActive = false;
     });

    console.log(`%c Listeners para amigo ${friendId} (dados e mensagens) OK.`, 'color: blue;');
}


// --- Funções Firebase Updates (Agora usam UID) ---

// Atualiza estado (status, timer) do usuário no DB
function updateFirebaseUserState(isInitialUpdate = false) {
    if (!currentUser || !stateRef) {
         console.warn("Tentativa de updateFirebaseUserState sem usuário ou stateRef.");
         return; // Sai se não estiver logado ou ref não pronta
    }

    let statusToUpdate;
    if (timer.isRunning) {
        statusToUpdate = timer.mode; // pomodoro, shortBreak, longBreak
    } else {
         // Verifica conexão online/offline de forma mais robusta se possível
         // Por simplicidade, vamos assumir 'online' e deixar onDisconnect cuidar do offline
         statusToUpdate = 'online';
    }

    const stateData = {
        status: statusToUpdate,
        timeRemaining: timer.minutes * 60 + timer.seconds,
        currentMode: timer.mode,
        isRunning: timer.isRunning,
        lastUpdate: firebase.database.ServerValue.TIMESTAMP
    };

     // Atualiza o nó 'state'
     stateRef.update(stateData).catch(e => console.error("Erro ao atualizar estado do usuário:", e));

     // Atualiza estado local (exceto se for o timer rodando)
     if (userData.status !== statusToUpdate && !timer.isRunning) {
         userData.status = statusToUpdate;
         updateStatusIndicator(userData.status);
     }
     // Atualiza tempo restante local (exceto se for o timer rodando)
      if (!timer.isRunning) {
          userData.timeRemaining = stateData.timeRemaining;
      }
     // Atualiza lastUpdate local para evitar sobrescrever com dados antigos
     // userData.lastUpdate = Date.now(); // Estimativa local do timestamp do servidor
}


// Salva configurações no DB
function saveSettingsToDB() {
    if (!currentUser || !settingsRef) {
        console.warn("Tentativa de saveSettingsToDB sem usuário ou settingsRef.");
        return;
    }
     // Pega os valores da UI
     const uiSettings = {
         pomodoro: parseInt(document.getElementById('pomodoro-time').value) || 25,
         shortBreak: parseInt(document.getElementById('short-break-time').value) || 5,
         longBreak: parseInt(document.getElementById('long-break-time').value) || 15,
         longBreakInterval: parseInt(longBreakIntervalInput.value) || 4,
         autoStartTimers: autoStartTimersToggle.checked,
         soundNotification: document.getElementById('sound-notification').checked,
         desktopNotification: document.getElementById('desktop-notification').checked,
         friendNotification: document.getElementById('friend-notification').checked
     };
     // Atualiza o nó 'settings'
     settingsRef.update(uiSettings)
         .then(() => {
             showNotification('Salvo!', 'Preferências atualizadas no servidor.', 'success');
             console.log("Settings salvas no DB:", uiSettings);
             // O listener handleSettingsChange vai atualizar o 'settings' local e a UI
         })
         .catch(e => {
             console.error("Erro ao salvar settings no DB:", e);
             showNotification('Erro', 'Não foi possível salvar as configurações.', 'error');
         });
}

// Salva estatísticas no DB
function saveStatsToDB() {
    if (!currentUser || !statsRef) {
         console.warn("Tentativa de saveStatsToDB sem usuário ou statsRef.");
         return;
    }
    const statsData = {
        studyTimeToday: userData.studyTimeToday || 0,
        studyTimeWeek: userData.studyTimeWeek || 0,
        completedPomodoros: userData.completedPomodoros || 0,
        studyHistory: userData.studyHistory || Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 })),
        pomodorosSinceLongBreak: timer.pomodorosSinceLongBreak || 0 // Usa valor do timer que é atualizado
    };
    // Atualiza o nó 'stats'
    statsRef.update(statsData).catch(e => console.error("Erro ao salvar stats no DB:", e));
     // Os dados locais já estão atualizados, o listener confirmará a sincronia
}

// Salva conquistas no DB
function saveAchievementsToDB(unlockedAchievementIds) {
     if (!currentUser || !achievementsRef) {
         console.warn("Tentativa de saveAchievementsToDB sem usuário ou achievementsRef.");
         return;
     }
     // Salva apenas o array de IDs desbloqueados
     achievementsRef.set(unlockedAchievementIds)
          .then(() => console.log("Achievements salvos no DB:", unlockedAchievementIds))
          .catch(e => console.error("Erro ao salvar achievements no DB:", e));
}


// --- Funções de Amizade (Adaptadas para UIDs) ---

async function sendFriendRequest(friendCode) {
    if (!currentUser || !userRef) {
        showNotification('Erro', 'Você não está logado.', 'error'); return;
    }
    if (!friendCode || friendCode.trim() === '') {
        showNotification('Erro', 'Digite um código de amigo.', 'error'); return;
    }
    friendCode = friendCode.trim().toUpperCase();
    if (friendCode === userData.connectionCode) {
        showNotification('Erro', 'Você não pode adicionar a si mesmo.', 'error'); return;
    }
    if (userData.friendId) {
        showNotification('Aviso', 'Você já está conectado a um amigo.', 'warning'); return;
    }

    console.log('Procurando amigo com código:', friendCode);
    showNotification('Procurando...', `Buscando usuário com código ${friendCode}...`, 'info');

    try {
        // Busca usuário pelo connectionCode no nó 'profile'
        const usersProfileRef = database.ref('users');
        const snap = await usersProfileRef.orderByChild('profile/connectionCode').equalTo(friendCode).limitToFirst(1).once('value');

        if (!snap.exists()) {
            showNotification('Não Encontrado', `Nenhum usuário encontrado com o código ${friendCode}. Verifique o código e tente novamente.`, 'error');
            return;
        }

        let friendUid = null;
        let friendProfileData = null;
        snap.forEach(childSnap => { // Pega o primeiro resultado
            friendUid = childSnap.key;
            friendProfileData = childSnap.child('profile').val(); // Pega só o perfil
        });

        if (!friendUid || !friendProfileData) {
            showNotification('Erro', 'Falha ao obter dados do amigo encontrado.', 'error');
            return;
        }

        // Verifica se o amigo encontrado já está conectado a alguém
        if (friendProfileData.friendId && friendProfileData.friendId !== currentUser.uid) {
            showNotification('Ocupado', `${friendProfileData.name || 'Usuário'} já está conectado a outro amigo.`, 'warning');
            return;
        }

        // Verifica se já existe um pedido pendente nosso para esse amigo
        const friendRequestsRef = database.ref(`requests/${friendUid}/${currentUser.uid}`);
        const reqSnap = await friendRequestsRef.once('value');
        if (reqSnap.exists()) {
            showNotification('Pedido Enviado', 'Você já enviou um pedido para este usuário.', 'warning');
            return;
        }

        // Cria o pedido no nó do amigo
        const requestData = {
            senderId: currentUser.uid,
            senderName: userData.name, // Usa o nome do usuário atual
            senderCode: userData.connectionCode, // Envia nosso código (opcional)
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        await friendRequestsRef.set(requestData);

        showNotification('Pedido Enviado', `Pedido de amizade enviado para ${friendProfileData.name || 'usuário'}.`, 'success');
        friendCodeInput.value = '';

    } catch (error) {
        console.error("Erro ao enviar pedido de amizade:", error);
        showNotification('Erro', 'Falha ao enviar o pedido. Verifique sua conexão.', 'error');
    }
}

async function acceptFriendRequest(senderId, senderName) {
    if (!currentUser || !userRef) {
         showNotification('Erro', 'Você não está logado.', 'error'); return;
    }
    if (userData.friendId) {
        showNotification('Aviso', 'Você já está conectado a um amigo. Desconecte primeiro.', 'warning');
        return;
    }
    if (!senderId) {
        console.error("acceptFriendRequest chamado sem senderId"); return;
    }

    console.log("Aceitando pedido de:", senderId, senderName);
    showNotification("Conectando...", `Aceitando pedido de ${senderName}...`, 'info');

    try {
        // Referências para os perfis de ambos
        const friendProfileRef = database.ref(`users/${senderId}/profile`);
        const userProfileRef = userRef.child('profile');

        // Atualiza o friendId em ambos os perfis
        await friendProfileRef.update({ friendId: currentUser.uid });
        await userProfileRef.update({ friendId: senderId });

        // Remove o pedido do nó de requests
        await requestsRef.child(senderId).remove();

        console.log("Amizade estabelecida com:", senderId);
        showNotification('Conectado!', `Agora você está conectado com ${senderName}!`, 'success');
        // O listener handleProfileChange vai detectar a mudança e chamar setupFriendListener
        // unlockAchievement('friend_connect'); // O listener handleProfileChange já faz isso

    } catch (error) {
        console.error("Erro ao aceitar pedido de amizade:", error);
        showNotification('Erro', 'Falha ao aceitar o pedido. Tente novamente.', 'error');
        // Reverter a atualização se uma delas falhou? (complexo)
        // Tenta garantir que o friendId local seja nulo se falhou
         if (userData.friendId === senderId) {
            userRef.child('profile/friendId').set(null);
         }
    }
}

async function rejectFriendRequest(senderId) {
    if (!currentUser || !requestsRef) return;
    if (!senderId) { console.error("rejectFriendRequest chamado sem senderId"); return; }

    console.log("Recusando pedido de:", senderId);
    try {
        await requestsRef.child(senderId).remove();
        showNotification('Pedido Recusado', 'O pedido de amizade foi recusado.', 'info');
    } catch (error) {
        console.error("Erro ao recusar pedido de amizade:", error);
        showNotification('Erro', 'Falha ao recusar o pedido.', 'error');
    }
}

// Desconecta do amigo atual (limpa friendId em ambos os DBs)
async function disconnectFriend(notifyFriend = true) {
    const friendIdToDisconnect = userData.friendId; // Pega o friendId atual
    if (!currentUser || !userRef || !friendIdToDisconnect) {
        console.warn("Tentativa de disconnectFriend sem usuário logado ou amigo conectado.");
        disconnectFriendLocal(); // Garante limpeza local
        return;
    }

    console.log(`%c Iniciando desconexão do amigo: ${friendIdToDisconnect}. Notificar amigo = ${notifyFriend}`, 'color: red; font-weight: bold;');
    showNotification("Desconectando...", `Encerrando conexão com ${friendData.name || 'amigo'}...`, "info");

    // Limpa listeners e UI local imediatamente
    disconnectFriendLocal();

    try {
        // Define friendId como null no nosso perfil
        await userRef.child('profile/friendId').set(null);
        console.log("%c FriendId removido do perfil local no DB.", 'color: red;');

        // Se devemos notificar, define friendId como null no perfil do amigo também
        if (notifyFriend) {
            const friendToNotifyRef = database.ref(`users/${friendIdToDisconnect}/profile`);
            await friendToNotifyRef.update({ friendId: null }); // Usa update para não apagar outros dados
            console.log(`%c FriendId removido do perfil do amigo (${friendIdToDisconnect}) no DB.`, 'color: red;');
        }
        showNotification("Desconectado", "Você não está mais conectado ao amigo.", "success");

    } catch (error) {
        console.error("Erro durante a desconexão no Firebase:", error);
        showNotification("Erro", "Ocorreu um erro ao desconectar.", "error");
        // Mesmo com erro, o friendId local já foi limpo pela chamada a disconnectFriendLocal()
    }
}

// Função auxiliar para limpar estado local relacionado ao amigo (UI e listeners)
function disconnectFriendLocal() {
     console.log("%c Limpando estado local do amigo...", 'color: red;');
     isConnectedToFriend = false;
     userData.friendId = null; // Limpa friendId local
     focusTogetherBtn.disabled = true;
     disconnectFriendBtn.style.display = 'none';
     resetFriendUI(); // Limpa a UI do cartão de amigo

     // Remove listener do amigo e de mensagens se estiverem ativos
     if (friendRef) {
         friendRef.off();
         friendRef = null;
         friendListenerActive = false;
         console.log("%c Listener do amigo removido.", 'color: red;');
     }
     if (messagesRef) {
         messagesRef.off();
         messagesRef = null;
         messagesListenerActive = false;
          console.log("%c Listener de mensagens do amigo removido.", 'color: red;');
     }
     console.log("%c Estado local do amigo limpo.", 'color: red;');
}


function sendQuickMessage(message) {
    if (!currentUser) { showNotification('Erro', 'Você não está logado.', 'error'); return; }
    if (!isConnectedToFriend || !friendData.id) {
        showNotification('Erro', 'Você não está conectado a um amigo para enviar mensagens.', 'warning');
        return;
    }

    // A referência agora é para onde NÓS escrevemos para o AMIGO ler
    const messagesTargetRef = database.ref(`messages/${friendData.id}/${currentUser.uid}`);

    const messageData = {
        text: message,
        senderId: currentUser.uid,
        senderName: userData.name, // Nosso nome
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        isFocusTogetherRequest: false // Define como falso para mensagens rápidas
    };

    // Usa push() para criar um ID único para a mensagem
    messagesTargetRef.push().set(messageData)
        .then(() => {
            showNotification('Mensagem Enviada', `Mensagem "${message}" enviada para ${friendData.name}.`, 'success');
        })
        .catch(error => {
            console.error("Erro ao enviar mensagem rápida:", error);
            showNotification('Erro', 'Falha ao enviar a mensagem.', 'error');
        });
}

function initiateFocusTogether() {
    if (!currentUser) { showNotification('Erro', 'Você não está logado.', 'error'); return; }
    if (!isConnectedToFriend || !friendData.id) {
        showNotification('Erro', 'Conecte-se a um amigo para iniciar uma sessão conjunta.', 'warning');
        return;
    }

     // A referência agora é para onde NÓS escrevemos para o AMIGO ler
     const messagesTargetRef = database.ref(`messages/${friendData.id}/${currentUser.uid}`);

    const messageData = {
        text: `🔥 ${userData.name} convidou você para uma sessão de estudo conjunta!`, // Texto informativo
        senderId: currentUser.uid,
        senderName: userData.name,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        isFocusTogetherRequest: true // Flag para indicar que é um convite
    };

    messagesTargetRef.push().set(messageData)
        .then(() => {
            showNotification('Convite Enviado', `Convite de foco conjunto enviado para ${friendData.name}! Iniciando seu Pomodoro...`, 'success');
            unlockAchievement('focus_together'); // Desbloqueia conquista
             // Inicia o timer do próprio usuário
             setTimerMode('pomodoro');
             startTimer();
        })
        .catch(error => {
            console.error("Erro ao enviar convite de foco conjunto:", error);
            showNotification('Erro', 'Falha ao enviar o convite.', 'error');
        });
}

// --- Funções do Timer (Adaptadas para salvar estado no DB) ---
function startTimer() {
    if (timer.isRunning) return;
    if (!currentUser) { showNotification('Erro', 'Faça login para iniciar o timer.', 'error'); return; }

    timer.isRunning = true;
    timer.startTime = Date.now();
    // Define totalTime baseado nas settings atuais para este ciclo
    timer.totalTime = timer.minutes * 60 + timer.seconds;
    updateUserStatusUI(); // Atualiza indicador visual local
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timerDisplay.classList.remove('timer-paused'); // Garante que não está com estilo de pausa
    timerDisplay.classList.add('timer-running');
    // editTimerHint.style.opacity = 0; // Hint removido
    showFocusMessage();
    updateFirebaseUserState(); // Atualiza estado (isRunning=true, status=modo, timeRemaining) no DB

    if (timer.interval) clearInterval(timer.interval);
    timer.interval = setInterval(updateTimer, 1000);
    console.log("Timer iniciado:", timer.mode);
}

function pauseTimer() {
    if (!timer.isRunning) return;
    if (!currentUser) return; // Segurança

    const wasPomodoro = timer.mode === 'pomodoro'; // Verifica se era Pomodoro ANTES de pausar

    timer.isRunning = false;
    clearInterval(timer.interval);
    timer.interval = null;

    // Calcula tempo decorrido APENAS se for modo Pomodoro
    if (wasPomodoro && timer.startTime) { // Usa wasPomodoro aqui
        const elapsedSeconds = Math.round((Date.now() - timer.startTime) / 1000);
        if (elapsedSeconds > 0) {
            console.log(`Pomodoro pausado. Tempo decorrido: ${elapsedSeconds}s`);
            userData.studyTimeToday += elapsedSeconds;
            userData.studyTimeWeek += elapsedSeconds;
            updateStatsUI(); // Atualiza UI
            saveStatsToDB(); // Salva stats atualizados no DB
            checkTimeAchievements(); // Verifica conquistas de tempo
        }
    }
    timer.startTime = null; // Reseta tempo de início

    // Define o status visual local (pode ser diferente do Firebase)
    updateUserStatusUI('online'); // <<< Mantém a UI local como 'online' ou pode mudar se preferir

    // Atualiza botões e display
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    timerDisplay.classList.add('timer-paused'); // Adiciona estilo de pausa
    timerDisplay.classList.remove('timer-running');
    hideFocusMessage();

    // --- MODIFICAÇÃO PRINCIPAL AQUI ---
    // Atualiza estado no Firebase: mantém 'pomodoro' se estava rodando pomodoro, senão 'online'
    const statusForFirebase = wasPomodoro ? 'pomodoro' : 'online';
    const stateData = {
        status: statusForFirebase, // <<< USA statusForFirebase
        isRunning: false, // <<< SEMPRE false ao pausar
        timeRemaining: timer.minutes * 60 + timer.seconds,
        currentMode: timer.mode, // Mantém o modo atual
        lastUpdate: firebase.database.ServerValue.TIMESTAMP
    };
    if (stateRef) {
         stateRef.update(stateData).catch(e => console.error("Erro ao atualizar estado do usuário (pausa):", e));
    }
    // --- FIM DA MODIFICAÇÃO ---

    console.log("Timer pausado. Status para Firebase:", statusForFirebase);
}

function resetTimer() {
    if (timer.isRunning) {
        // Se estava rodando, calcula tempo decorrido como se tivesse pausado
         if (timer.mode === 'pomodoro' && timer.startTime) {
             const elapsedSeconds = Math.round((Date.now() - timer.startTime) / 1000);
             if (elapsedSeconds > 0) {
                 console.log(`Pomodoro resetado durante execução. Tempo decorrido: ${elapsedSeconds}s`);
                 userData.studyTimeToday += elapsedSeconds;
                 userData.studyTimeWeek += elapsedSeconds;
                 updateStatsUI();
                 saveStatsToDB();
                 checkTimeAchievements();
             }
         }
        // Para a execução
        timer.isRunning = false;
        clearInterval(timer.interval);
        timer.interval = null;
        timer.startTime = null;
    }

    // Reseta minutos/segundos para o padrão do modo atual
    timer.minutes = settings[timer.mode];
    timer.seconds = 0;
    timer.totalTime = timer.minutes * 60; // Recalcula totalTime

    updateTimerDisplay();
    updateProgressRing(1);
    updateUserStatusUI('online'); // Define status local como online
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    timerDisplay.classList.remove('timer-running', 'timer-paused');
    // editTimerHint.style.opacity = 0.7; // Hint removido
    hideFocusMessage();
    updateFirebaseUserState(); // Atualiza estado (isRunning=false, status=online, timeRemaining) no DB
    console.log("Timer resetado para o modo:", timer.mode);
}

function updateTimer() {
    if (!timer.isRunning) return;

    if (timer.seconds === 0) {
        if (timer.minutes === 0) {
            timerComplete(); // Chama a função quando o tempo acaba
            return;
        }
        timer.minutes--;
        timer.seconds = 59;
    } else {
        timer.seconds--;
    }

    const remainingSecondsTotal = timer.minutes * 60 + timer.seconds;
    const percentage = remainingSecondsTotal / timer.totalTime;

    updateTimerDisplay();
    updateProgressRing(percentage);

    // Atualiza o tempo restante no Firebase a cada segundo
    // Evitar update completo do estado, apenas o tempo se possível
    if (currentUser && stateRef) {
         stateRef.update({ timeRemaining: remainingSecondsTotal })
             .catch(e => console.warn("Warn: Falha ao atualizar timeRemaining no DB", e)); // Log como aviso
    }
}


function updateTimerDisplay() {
    minutesEl.textContent = String(timer.minutes).padStart(2, '0');
    secondsEl.textContent = String(timer.seconds).padStart(2, '0');
    document.title = `${String(timer.minutes).padStart(2, '0')}:${String(timer.seconds).padStart(2, '0')} - EstudoSync`;
}

function updateProgressRing(percentage) {
    const radius = progressRingCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage);
    // Garante que o offset não seja negativo ou maior que a circunferência
    progressRingCircle.style.strokeDashoffset = Math.max(0, Math.min(offset, circumference));
}

// function editCurrentTimer() { ... } // Removida

function timerComplete() {
    const completedMode = timer.mode;

    // Para o intervalo e marca como não rodando
    if (timer.isRunning) {
        clearInterval(timer.interval);
        timer.interval = null;
        timer.isRunning = false;
        timer.startTime = null;
    } else {
        console.warn("timerComplete chamado, mas timer.isRunning já era false.");
    }

     let nextMode;
     let notificationTitleText;
     let notificationBodyText;

    // Se completou um Pomodoro
    if (completedMode === 'pomodoro') {
        // Calcula duração exata do Pomodoro (baseado nas settings)
        const pomodoroDurationSeconds = settings.pomodoro * 60;
        userData.studyTimeToday += pomodoroDurationSeconds;
        userData.studyTimeWeek += pomodoroDurationSeconds;
        userData.completedPomodoros++;
        timer.pomodorosSinceLongBreak++; // Incrementa contador para pausa longa

        // Atualiza stats e salva no DB
        updateStatsUI();
        saveStatsToDB();
        // Salva pomodorosSinceLongBreak separadamente ou junto com stats? (Junto com stats é melhor)

        // Verifica conquistas
        checkPomodoroAchievements();
        checkTimeAchievements();

        // Determina próxima pausa
        if (timer.pomodorosSinceLongBreak >= settings.longBreakInterval) {
            notificationTitleText = 'Ciclo Concluído!';
            notificationBodyText = `Hora da pausa longa (${settings.longBreak} min). Bom trabalho!`;
            nextMode = 'longBreak';
            timer.pomodorosSinceLongBreak = 0; // Reseta contador
            saveStatsToDB(); // Salva o contador resetado
        } else {
            notificationTitleText = 'Pomodoro Concluído!';
            notificationBodyText = `Hora da pausa curta (${settings.shortBreak} min). Respire fundo!`;
            nextMode = 'shortBreak';
        }
    }
    // Se completou uma Pausa
    else {
        notificationTitleText = 'Pausa Concluída!';
        notificationBodyText = `De volta ao foco! Próximo Pomodoro (${settings.pomodoro} min).`;
        nextMode = 'pomodoro';
    }

    // Notificações
    if (settings.soundNotification) playSound(notificationSound);
    showNotification(notificationTitleText, notificationBodyText, 'info');
    if (settings.desktopNotification && Notification.permission === 'granted') {
        new Notification(notificationTitleText, { body: notificationBodyText });
    }

    // Prepara para o próximo modo
    setTimerMode(nextMode); // Define o próximo modo e reseta o timer para ele

    // Atualiza UI pós-conclusão
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    timerDisplay.classList.remove('timer-running', 'timer-paused');
    // editTimerHint.style.opacity = 0.7; // Hint removido
    hideFocusMessage();

     // Atualiza estado final no Firebase (isRunning=false, status=online, time=resetado)
     updateFirebaseUserState();

    // Inicia automaticamente se a configuração estiver ativa
    if (settings.autoStartTimers) {
        console.log("Iniciando próximo timer automaticamente...");
        startTimer();
    }
}

function setTimerMode(mode) {
    if (!settings[mode]) {
        console.error("Tentativa de definir modo de timer inválido:", mode);
        return;
    }
    // Se estiver rodando, pausa primeiro (e salva tempo decorrido se for pomodoro)
    if (timer.isRunning) {
         if (!confirm('O timer está rodando. Deseja realmente mudar de modo e parar o timer atual?')) {
             return;
         }
         pauseTimer(); // Pausa e salva tempo/atualiza DB
     }

    timer.mode = mode;
    timer.minutes = settings[mode]; // Usa tempo das configurações carregadas
    timer.seconds = 0;
    timer.totalTime = timer.minutes * 60; // Recalcula

    // Atualiza botões de modo na UI
    modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));

    // Atualiza display do timer e anel de progresso
    updateTimerDisplay();
    updateProgressRing(1);

    // Garante que UI e estado Firebase reflitam que não está rodando
    timer.isRunning = false; // Garante que está parado
    updateUserStatusUI('online'); // Status visual online
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    timerDisplay.classList.remove('timer-running', 'timer-paused');
    hideFocusMessage();
    updateFirebaseUserState(); // Atualiza Firebase (isRunning=false, status=online, time=resetado)

    console.log("Modo do timer definido para:", mode);
}

// --- Funções Status, Stats, Settings, UI (Adaptadas) ---

// Atualiza apenas o indicador visual na UI
function updateUserStatusUI(status = null) {
     const currentStatus = status ? status : (timer.isRunning ? timer.mode : 'online');
     userData.status = currentStatus; // Atualiza status local para consistência da UI
     updateStatusIndicator(currentStatus);
}

// Atualiza o ponto e texto de status na UI
function updateStatusIndicator(status) {
    userStatusDot.className = 'status-dot'; // Limpa classes antigas
    let statusText = 'Offline';
    switch (status) {
        case 'online':
            statusText = 'Online';
            userStatusDot.classList.add('online');
            break;
        case 'pomodoro': // Usar 'pomodoro' em vez de 'studying'
            statusText = 'Foco (Pomodoro)';
            userStatusDot.classList.add('studying'); // Mantém cor verde
            break;
        case 'shortBreak':
            statusText = 'Pausa Curta';
            userStatusDot.classList.add('shortBreak');
            break;
        case 'longBreak':
            statusText = 'Pausa Longa';
            userStatusDot.classList.add('longBreak');
            break;
        default: // offline ou desconhecido
             statusText = 'Offline';
             userStatusDot.classList.add('offline');
             break; // Adiciona break
    }
    userStatusText.textContent = statusText;
}

// Atualiza a UI com os dados de estatísticas locais (userData)
function updateStatsUI() {
    todayTimeEl.textContent = formatTime(userData.studyTimeToday || 0);
    weekTimeEl.textContent = formatTime(userData.studyTimeWeek || 0);
    pomodoroCountEl.textContent = userData.completedPomodoros || 0;
    // Atualiza dados do gráfico
     if (studyTimeChart) {
         updateChart(userData.studyHistory);
     }
}

// Formata segundos para HH:MM:SS
function formatTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Atualiza o histórico local (userData.studyHistory) - chamado ao salvar stats
function updateStudyHistoryLocal() {
     const today = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ...
     const historyIndex = today === 0 ? 6 : today - 1; // Ajusta índice (0=Seg, 6=Dom)
     if (userData.studyHistory && userData.studyHistory[historyIndex]) {
         // Atualiza o tempo em minutos para o dia atual
         userData.studyHistory[historyIndex].time = Math.floor((userData.studyTimeToday || 0) / 60);
     } else {
          console.warn("Histórico de estudo não inicializado corretamente.");
     }
}


// Aplica as configurações carregadas (objeto 'settings') aos inputs da UI
function applySettingsToUI() {
    document.getElementById('pomodoro-time').value = settings.pomodoro;
    document.getElementById('short-break-time').value = settings.shortBreak;
    document.getElementById('long-break-time').value = settings.longBreak;
    longBreakIntervalInput.value = settings.longBreakInterval;
    autoStartTimersToggle.checked = settings.autoStartTimers;
    document.getElementById('sound-notification').checked = settings.soundNotification;
    document.getElementById('desktop-notification').checked = settings.desktopNotification;
    document.getElementById('friend-notification').checked = settings.friendNotification;
}


// --- Reset de Stats Diários/Semanais ---
function checkAndResetStats() {
     const todayStr = new Date().toLocaleDateString();
     const currentDayOfWeek = new Date().getDay(); // 0 = Domingo, 1 = Segunda

     // Verifica se a data da última visita é diferente de hoje
     if (userData.lastVisitDate !== todayStr) {
         console.log("Nova visita detectada. Resetando estatísticas diárias.");
         userData.studyTimeToday = 0;
         // Atualiza a data da última visita localmente e no DB
         userData.lastVisitDate = todayStr;
         if(userRef) userRef.child('profile/lastVisitDate').set(todayStr);

         // Verifica se hoje é Segunda-feira (início da semana)
         if (currentDayOfWeek === 1) {
             console.log("Início da semana (Segunda-feira). Resetando estatísticas semanais e histórico.");
             userData.studyTimeWeek = 0;
             // Reseta o histórico de estudo para a semana
             userData.studyHistory = Array(7).fill(null).map((_, i) => ({ day: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i], time: 0 }));
         } else if (userData.studyHistory) {
              // Se não for segunda, apenas zera o dia correspondente no histórico local
              // A linha abaixo pode não ser necessária se updateStudyHistoryLocal for chamado corretamente
              // const historyIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
              // if (userData.studyHistory[historyIndex]) userData.studyHistory[historyIndex].time = 0;
         }

          // Reseta pomodorosDesdeUltimaPausaLonga (se necessário, embora já seja resetado ao completar ciclo)
          // userData.pomodorosSinceLongBreak = 0; // Opcional: resetar no início do dia?

         // Salva os stats resetados no DB
         saveStatsToDB();
         updateStatsUI(); // Atualiza a UI imediatamente
     } else {
          console.log("Mesma data da última visita. Stats diários mantidos.");
     }
}


// --- Gráfico e Conquistas (Adaptados) ---

function initializeChart() {
    if (!studyChartEl) return;
    const ctx = studyChartEl.getContext('2d');
    if (!ctx) return;

    // Usa dados iniciais (vazios ou carregados)
    const labels = userData.studyHistory.map(item => item.day);
    const dataValues = userData.studyHistory.map(item => item.time);

    if (studyTimeChart) studyTimeChart.destroy(); // Destrói gráfico anterior se existir

    studyTimeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tempo de Estudo (min)',
                data: dataValues,
                backgroundColor: 'rgba(108, 92, 231, 0.6)', // Usar variável CSS?
                borderColor: 'rgba(108, 92, 231, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Minutos' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
    console.log("Gráfico inicializado.");
}

// Atualiza o gráfico com novos dados de histórico
function updateChart(historyData) {
    if (!studyTimeChart || !historyData) return;
    studyTimeChart.data.labels = historyData.map(item => item.day);
    studyTimeChart.data.datasets[0].data = historyData.map(item => item.time);
    studyTimeChart.update();
}

// Renderiza conquistas na UI baseado no array 'currentAchievements'
function renderAchievements() {
    if (!achievementsListEl) return;
    achievementsListEl.innerHTML = ''; // Limpa antes de renderizar
    if (!currentAchievements || currentAchievements.length === 0) {
         // Se não houver conquistas carregadas, mostra placeholders ou mensagem
         achievementsListEl.innerHTML = '<p>Carregando conquistas...</p>'; // Ou usar os defaults
         currentAchievements = defaultAchievements.map(a => ({...a})); // Clona defaults temporariamente
    }

    currentAchievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = `achievement ${ach.unlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="achievement-icon"><i class="${ach.icon || 'fas fa-question-circle'}"></i></div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
        `;
        achievementsListEl.appendChild(div);
    });
}


function checkPomodoroAchievements() {
    let changed = false;
    if (userData.completedPomodoros >= 1) changed = unlockAchievementLocal('first_pomodoro') || changed;
    if (userData.completedPomodoros >= 5) changed = unlockAchievementLocal('five_pomodoros') || changed;
    // Se alguma conquista mudou, salva no DB
    if (changed) {
         const unlockedIds = currentAchievements.filter(a => a.unlocked).map(a => a.id);
         saveAchievementsToDB(unlockedIds);
     }
}

function checkTimeAchievements() {
     let changed = false;
     const studyTimeHours = (userData.studyTimeToday || 0) / 3600;
     if (studyTimeHours >= 1) changed = unlockAchievementLocal('one_hour') || changed;
     if (studyTimeHours >= 3) changed = unlockAchievementLocal('three_hours') || changed;
      // Se alguma conquista mudou, salva no DB
     if (changed) {
         const unlockedIds = currentAchievements.filter(a => a.unlocked).map(a => a.id);
         saveAchievementsToDB(unlockedIds);
     }
}

// Desbloqueia conquista apenas localmente e na UI, retorna true se houve mudança
function unlockAchievementLocal(id) {
    const achievement = currentAchievements.find(ach => ach.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        renderAchievements(); // Re-renderiza para mostrar desbloqueio
        showNotification('🏆 Conquista Desbloqueada!', `${achievement.name}`, 'success');
        console.log("Conquista desbloqueada localmente:", id);
        return true; // Indica que houve mudança
    }
    return false; // Indica que não houve mudança
}

// Wrapper para chamar unlockAchievementLocal e salvar no DB se mudar
function unlockAchievement(id) {
     if (unlockAchievementLocal(id)) {
         const unlockedIds = currentAchievements.filter(a => a.unlocked).map(a => a.id);
         saveAchievementsToDB(unlockedIds);
     }
}


// --- Funções UI Auxiliares (Adaptadas) ---

function showNotification(title, message, type = 'info') {
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    const iconMap = { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle' };
    const iconElement = notificationEl.querySelector('.notification-icon i');
    iconElement.className = `fas ${iconMap[type] || 'fa-info-circle'}`; // Define o ícone correto
    notificationEl.className = `notification ${type} show`; // Adiciona classe de tipo e 'show'
    // Auto-hide após 5 segundos
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, 5000);
}

// Atualiza a UI do card de status do amigo
function updateFriendUI() {
    if (!isConnectedToFriend || !friendData.id) {
        resetFriendUI();
        return;
    }
    friendNameEl.textContent = friendData.name || 'Amigo';
    const statusDot = friendCurrentStatus.querySelector('.status-dot');
    const statusText = friendCurrentStatus.querySelector('span:last-child');
    statusDot.className = 'status-dot'; // Limpa classes
    let statusLabel = 'Offline';
    let isPausedPomodoro = false; // Flag para pomodoro pausado

    switch (friendData.status) {
        case 'online':
            statusLabel = 'Online';
            statusDot.classList.add('online');
            break;
        case 'pomodoro':
            // --- MODIFICAÇÃO AQUI ---
            if (friendData.isRunning) {
                statusLabel = 'Foco (Pomodoro)';
                statusDot.classList.add('studying'); // Verde para estudando
            } else {
                statusLabel = 'Pausado (Pomodoro)'; // <<< Texto para pausado
                statusDot.classList.add('paused'); // <<< Adiciona classe para estilo (opcional)
                isPausedPomodoro = true;
            }
            // --- FIM DA MODIFICAÇÃO ---
            break;
        case 'shortBreak':
            statusLabel = 'Pausa Curta';
            statusDot.classList.add('shortBreak'); // Amarelo/Laranja
            break;
        case 'longBreak':
            statusLabel = 'Pausa Longa';
            statusDot.classList.add('longBreak'); // Amarelo/Laranja
            break;
        default:
            statusDot.classList.add('offline'); // Cinza/Vermelho
            break;
    }
    statusText.textContent = statusLabel;

    // Mostra/esconde timer do amigo (mostra também se estiver pausado)
    if ((friendData.isRunning || isPausedPomodoro) && friendData.timeRemaining > 0) { // <<< Inclui isPausedPomodoro
        friendTimer.textContent = formatTime(friendData.timeRemaining);
        friendTimer.style.display = 'block';
    } else {
        friendTimer.textContent = '--:--';
        friendTimer.style.display = 'none';
    }
    // Mostra placeholder para clicar e ver perfil
    friendStatsPlaceholder.style.display = 'block';
}

// Reseta a UI do card de status do amigo para o estado inicial/desconectado
function resetFriendUI() {
    console.log("Resetando UI do amigo.");
    friendNameEl.textContent = 'Nenhum amigo conectado';
    const statusDot = friendCurrentStatus.querySelector('.status-dot');
    const statusText = friendCurrentStatus.querySelector('span:last-child');
    statusDot.className = 'status-dot offline';
    statusText.textContent = 'Offline';
    friendTimer.textContent = '--:--';
    friendTimer.style.display = 'none';
    friendStatsPlaceholder.style.display = 'none';
    closeFriendProfileModal(); // Fecha modal se estiver aberto
    focusTogetherBtn.disabled = true;
    disconnectFriendBtn.style.display = 'none';
}


function checkFriendStatusChange(newStatus) {
    // Não notifica se a configuração estiver desativada
    if (!settings.friendNotification) return;

    const oldStatus = friendData.status; // O status local já foi atualizado
    // Evita notificar na primeira carga ou se o status não mudou realmente
    if (!friendData.lastUpdate || oldStatus === newStatus) return;

    let message = '';
    const friendName = friendData.name || 'Seu amigo';

    switch (newStatus) {
        case 'pomodoro': message = `${friendName} começou a focar (Pomodoro)!`; break;
        case 'shortBreak': message = `${friendName} iniciou uma pausa curta.`; break;
        case 'longBreak': message = `${friendName} iniciou uma pausa longa.`; break;
        case 'online':
            // Notifica apenas se estava em um estado ativo (foco/pausa) antes
             if (oldStatus === 'pomodoro' || oldStatus === 'shortBreak' || oldStatus === 'longBreak') {
                message = `${friendName} terminou a atividade e está online.`;
             }
             break;
         case 'offline':
             // Notifica se estava online ou ativo antes
             if (oldStatus !== 'offline') {
                 message = `${friendName} ficou offline.`;
             }
             break;
    }

    if (message) {
        showNotification('Status do Amigo', message, 'info');
    }
}

// Abre o modal com informações do amigo
function openFriendProfileModal() {
    if (!isConnectedToFriend || !friendData.id) return;

    modalFriendName.textContent = friendData.name || 'Amigo';
    let statusText = 'Offline';
    switch (friendData.status) {
        case 'online': statusText = 'Online'; break;
        case 'pomodoro': statusText = 'Foco (Pomodoro)'; break;
        case 'shortBreak': statusText = 'Pausa Curta'; break;
        case 'longBreak': statusText = 'Pausa Longa'; break;
    }
    modalFriendStatus.textContent = statusText;
    modalFriendTimer.textContent = (friendData.isRunning && friendData.timeRemaining > 0) ? formatTime(friendData.timeRemaining) : '--:--';
    // Exibe estatísticas do amigo carregadas
    modalFriendTodayTime.textContent = formatTime(friendData.studyTimeToday || 0);
    modalFriendPomodoros.textContent = friendData.completedPomodoros || 0;

    friendProfileModal.style.display = 'block';
}

function closeFriendProfileModal() {
    friendProfileModal.style.display = 'none';
}

// Renderiza a lista de pedidos de amizade pendentes
function renderFriendRequests(requestsData) {
    friendRequestsListEl.innerHTML = ''; // Limpa lista
    const requestIds = Object.keys(requestsData);
    console.log("Renderizando requests para IDs:", requestIds); // <-- ADICIONE ESTA LINHA

    if (requestIds.length === 0) {
        friendRequestsListEl.innerHTML = '<li>Nenhum pedido pendente.</li>';
        return;
    }

    requestIds.forEach(senderId => {
        const request = requestsData[senderId];
        if (!request || !request.senderName) return; // Pula se dados inválidos

        const li = document.createElement('li');
        li.dataset.senderId = senderId; // Guarda o ID para os botões

        const infoSpan = document.createElement('span');
        infoSpan.textContent = `${request.senderName}: `;

        // Adiciona timestamp formatado
        try {
            const timestamp = new Date(request.timestamp).toLocaleString('pt-BR', { short: 'numeric' });
            const timeSmall = document.createElement('small');
            timeSmall.textContent = ` (${timestamp})`;
            infoSpan.appendChild(timeSmall);
        } catch (e) { console.warn("Erro ao formatar timestamp do pedido"); }

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'request-actions';

        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Aceitar';
        acceptBtn.className = 'accept-btn btn btn-small btn-success'; // Adiciona classe de sucesso
        acceptBtn.onclick = () => acceptFriendRequest(senderId, request.senderName);

        const rejectBtn = document.createElement('button');
        rejectBtn.textContent = 'Recusar';
        rejectBtn.className = 'reject-btn btn btn-small btn-danger'; // Adiciona classe de perigo
        rejectBtn.onclick = () => rejectFriendRequest(senderId);

        actionsDiv.appendChild(acceptBtn);
        actionsDiv.appendChild(rejectBtn);
        li.appendChild(infoSpan);
        li.appendChild(actionsDiv);
        friendRequestsListEl.appendChild(li);
    });
}

// Mostra mensagem de foco aleatória
function showFocusMessage() {
    const messages = [
        "Hora de focar! 💪", "Você consegue! 🚀", "Mantenha a concentração! 🎯",
        "Um passo de cada vez! ⏱️", "Continue firme! 🔥", "Concentre-se no agora! ✨",
        "Elimine as distrações! 🚫", "Produtividade no máximo! 🧠"
    ];
    focusMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    focusMessage.classList.add('visible');
}

function hideFocusMessage() {
    focusMessage.classList.remove('visible');
}

// Gera código de conexão (mantido, pois ainda é útil para iniciar)
function generateConnectionCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Exibe o código de conexão na UI
function displayConnectionCode() {
    if (userData.connectionCode) {
         yourCodeEl.textContent = userData.connectionCode;
    } else {
         yourCodeEl.textContent = 'Gerando...';
          // Tenta gerar e salvar se não existir (deve ser feito na inicialização)
          if(currentUser && userRef && !userData.connectionCode) {
               userData.connectionCode = generateConnectionCode();
               userRef.child('profile/connectionCode').set(userData.connectionCode)
                    .then(() => yourCodeEl.textContent = userData.connectionCode)
                    .catch(e => console.error("Erro ao gerar/salvar código inicial", e));
          }
    }
}


// Toca som de notificação
function playSound(audioElement) {
    if (!audioElement || !settings.soundNotification) return;
    audioElement.currentTime = 0; // Reinicia se já estiver tocando
    audioElement.play().catch(error => {
        // Navegadores podem bloquear autoplay se não houver interação do usuário
        console.warn("Não foi possível tocar o som de notificação:", error.message);
        // Poderia mostrar uma notificação visual pedindo para habilitar som
    });
}

// Pede permissão para notificações desktop
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("Este navegador não suporta notificações desktop.");
        // Desabilita a opção nas configurações?
         if(document.getElementById('desktop-notification')) {
             document.getElementById('desktop-notification').checked = false;
             document.getElementById('desktop-notification').disabled = true;
             // Opcional: Salvar essa preferência desabilitada
         }
        return;
    }

    if (Notification.permission === "granted") {
        console.log("Permissão para notificações já concedida.");
    } else if (Notification.permission !== "denied") {
         // Não pede automaticamente, espera o usuário habilitar nas settings
         console.log("Permissão para notificações não solicitada ou negada.");
         // O usuário pode habilitar a opção nas configurações,
         // e então pediremos a permissão ao salvar as settings.
    }
}

// Pede permissão DE FATO quando o usuário habilita nas settings
function askNotificationPermission() {
     if (!("Notification" in window)) return;
     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
               console.log("Permissão de notificação:", permission);
               if (permission === 'granted') {
                    showNotification("Notificações Habilitadas", "Você receberá notificações desktop.", "success");
               } else {
                    showNotification("Notificações Bloqueadas", "Você não receberá notificações desktop.", "warning");
                    // Desmarca a caixa nas settings se o usuário negou
                     document.getElementById('desktop-notification').checked = false;
               }
          });
     } else if (Notification.permission === "denied") {
          showNotification("Permissão Negada", "As notificações estão bloqueadas nas configurações do seu navegador.", "warning");
          document.getElementById('desktop-notification').checked = false; // Desmarca
     }
}


// --- Configuração de Event Listeners Gerais ---
function setupEventListeners() {
    console.log("Configurando event listeners gerais...");

    // Botões do Timer
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Notificação
    notificationClose.addEventListener('click', () => notificationEl.classList.remove('show'));

    // Código de Conexão
    copyCodeBtn.addEventListener('click', () => {
        if (userData.connectionCode) {
            navigator.clipboard.writeText(userData.connectionCode)
                .then(() => showNotification('Copiado!', 'Seu código de conexão foi copiado.', 'success'))
                .catch(err => {
                     console.error('Erro ao copiar código:', err);
                     showNotification('Erro', 'Não foi possível copiar o código.', 'error');
                });
        }
    });

    // Amizade
    addFriendBtn.addEventListener('click', () => sendFriendRequest(friendCodeInput.value));
    disconnectFriendBtn.addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja desconectar de ${friendData.name || 'seu amigo'}?`)) {
            disconnectFriend(true); // true para notificar o amigo
        }
    });
    removeFriendModalBtn.addEventListener('click', () => {
         if (confirm(`Tem certeza que deseja remover ${friendData.name || 'seu amigo'}? Esta ação desconectará ambos.`)) {
             closeFriendProfileModal(); // Fecha modal primeiro
             disconnectFriend(true);
         }
    });
    focusTogetherBtn.addEventListener('click', initiateFocusTogether);

    // Configurações
    saveSettingsBtn.addEventListener('click', () => {
         // Se a notificação desktop foi marcada, pede permissão antes de salvar
         if (document.getElementById('desktop-notification').checked && Notification.permission !== 'granted') {
              askNotificationPermission(); // Pede permissão
         }
         saveSettingsToDB(); // Salva no DB
    });

    // Modal do Perfil do Amigo
    friendStatusCard.addEventListener('click', openFriendProfileModal); // Abre ao clicar no card
    closeProfileModalBtn.addEventListener('click', closeFriendProfileModal);
    // Fecha modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === friendProfileModal) {
            closeFriendProfileModal();
        }
    });

    // Atalhos de Teclado (apenas quando app visível e foco não em input)
    document.addEventListener('keydown', (e) => {
         // Só executa se o app estiver visível e o auth escondido
         if (appContent.classList.contains('hidden') || !authContainer.classList.contains('hidden')) return;
         // Ignora se o foco estiver em um input ou textarea
         const targetTagName = e.target.tagName.toUpperCase();
         if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') return;

         if (e.code === 'Space') { // Espaço: Inicia/Pausa
             e.preventDefault();
             if (timer.isRunning) {
                 pauseTimer();
             } else {
                 startTimer();
             }
         } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey)) { // Ctrl/Cmd + R: Reset
             e.preventDefault();
             resetTimer();
         } else if (e.code === 'Escape') { // Esc: Fecha Modal
             closeFriendProfileModal();
         }
         // Adicionar outros atalhos se desejar (ex: mudar modo)
    });

    console.log("Event listeners gerais configurados.");
}

// --- Funções Setup UI Helpers (Mantidas como estavam) ---
function setupModeButtons() { modeBtns.forEach(btn => btn.addEventListener('click', () => setTimerMode(btn.dataset.mode))); }
function setupThemeToggle() {
     // Carrega tema salvo no localStorage
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme === 'dark') {
         document.body.setAttribute('data-theme', 'dark');
         themeToggle.checked = true;
     } else {
         document.body.removeAttribute('data-theme');
         themeToggle.checked = false;
     }
     // Listener para mudança
     themeToggle.addEventListener('change', () => {
         if (themeToggle.checked) {
             document.body.setAttribute('data-theme', 'dark');
             localStorage.setItem('theme', 'dark');
         } else {
             document.body.removeAttribute('data-theme');
             localStorage.setItem('theme', 'light');
         }
     });
 }
function setupMenuItems() { menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); const targetSectionId = item.dataset.section + '-section'; menuItems.forEach(i => i.classList.remove('active')); sections.forEach(s => s.classList.remove('active')); item.classList.add('active'); const targetElement = document.getElementById(targetSectionId); if (targetElement) targetElement.classList.add('active'); }); }); }
function setupNumberInputs() { document.querySelectorAll('.number-input').forEach(container => { const input = container.querySelector('input'); const decreaseBtn = container.querySelector('.decrease'); const increaseBtn = container.querySelector('.increase'); const min = parseInt(input.min) || 1; const max = parseInt(input.max) || 99; decreaseBtn.addEventListener('click', () => { let currentValue = parseInt(input.value) || min; if (currentValue > min) input.value = currentValue - 1; }); increaseBtn.addEventListener('click', () => { let currentValue = parseInt(input.value) || min; if (currentValue < max) input.value = currentValue + 1; }); input.addEventListener('change', () => { let currentValue = parseInt(input.value) || min; input.value = Math.max(min, Math.min(max, currentValue)); }); }); }
function setupQuickMessages() {
    messageBtns.forEach(btn => {
        btn.addEventListener('click', (event) => { // Adicione 'event' como parâmetro
            event.stopPropagation(); // <<< ADICIONE ESTA LINHA
            sendQuickMessage(btn.dataset.message);
        });
    });
}
// --- Inicialização ---
// A inicialização principal agora acontece dentro do onAuthStateChanged
// quando um usuário é detectado.