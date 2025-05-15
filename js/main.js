// Dados simulados para a aplicação
const USERS = [
    { id: 1, name: 'João Silva', email: 'joao@example.com', password: '123456', role: 'user', photo: 'img/user1.jpg', points: 120, matches: 15, wins: 10 },
    { id: 2, name: 'Maria Oliveira', email: 'maria@example.com', password: '123456', role: 'user', photo: 'img/user2.jpg', points: 150, matches: 18, wins: 12 },
    { id: 3, name: 'Pedro Santos', email: 'pedro@example.com', password: '123456', role: 'user', photo: 'img/user3.jpg', points: 180, matches: 20, wins: 15 },
    { id: 4, name: 'Ana Costa', email: 'ana@example.com', password: '123456', role: 'user', photo: 'img/user4.jpg', points: 90, matches: 12, wins: 7 },
    { id: 5, name: 'Admin', email: 'admin@pingasclub.com', password: 'admin123', role: 'admin', photo: 'img/admin.jpg', points: 0, matches: 0, wins: 0 }
];

const TOURNAMENTS = [
    { 
        id: 1, 
        title: 'Campeonato de Verão', 
        description: 'Campeonato de verão do Clube Pingas com premiação para os três primeiros colocados.', 
        startDate: '2023-12-15', 
        endDate: '2023-12-20', 
        location: 'Sede Principal', 
        status: 'open', 
        maxParticipants: 16, 
        participants: [1, 2, 3],
        image: 'img/tournament1.jpg'
    },
    { 
        id: 2, 
        title: 'Torneio Relâmpago', 
        description: 'Torneio rápido com partidas de 11 pontos em melhor de 3 sets.', 
        startDate: '2023-11-10', 
        endDate: '2023-11-10', 
        location: 'Quadra Externa', 
        status: 'closed', 
        maxParticipants: 8, 
        participants: [1, 2, 4],
        image: 'img/tournament2.jpg'
    },
    { 
        id: 3, 
        title: 'Copa Pingas', 
        description: 'O maior campeonato do ano com premiação especial e convidados.', 
        startDate: '2024-01-20', 
        endDate: '2024-01-30', 
        location: 'Ginásio Central', 
        status: 'upcoming', 
        maxParticipants: 32, 
        participants: [],
        image: 'img/tournament3.jpg'
    }
];

const MATCHES = [
    { id: 1, tournamentId: 1, player1: 1, player2: 2, score: '3-1', date: '2023-12-15', status: 'completed' },
    { id: 2, tournamentId: 1, player1: 3, player2: 4, score: '3-2', date: '2023-12-15', status: 'completed' },
    { id: 3, tournamentId: 1, player1: 1, player2: 3, score: '', date: '2023-12-18', status: 'scheduled' },
    { id: 4, tournamentId: 2, player1: 1, player2: 4, score: '2-0', date: '2023-11-10', status: 'completed' },
    { id: 5, tournamentId: 2, player1: 2, player2: 1, score: '2-1', date: '2023-11-10', status: 'completed' }
];

// Função para inicializar a página
function initPage() {
    // Verificar qual página está sendo carregada
    const currentPage = window.location.pathname.split('/').pop();
     // Atualizar interface com base no usuário logado
     updateUserInterface();
    
     // Carregar eventos próximos na página inicial
     loadUpcomingEvents();
     
     // Configurar formulário de login
     setupLoginForm();
     
     // Configurar formulário de cadastro
     setupRegistrationForm();
     
     // Carregar ranking
     loadRanking();
     
     // Carregar torneios
     loadTournaments();
     
     // Carregar carteirinha de membro
     loadMemberCard();
     
     // Configurar painel administrativo
     setupAdminDashboard();
     
     // Configurar página de administração de torneios
     if (window.location.pathname.includes('admin-tournaments.html')) {
         setupAdminTournaments();
     }
     
     // Configurar página de administração de usuários
     if (window.location.pathname.includes('admin-users.html')) {
         setupAdminUsers();
     }
     
     // Configurar página de administração de partidas
     if (window.location.pathname.includes('admin-matches.html')) {
         setupAdminMatches();
     }
    
    // Inicializar funcionalidades específicas da página
    switch(currentPage) {
        case 'index.html':
        case '':
            loadUpcomingEvents();
            break;
        case 'login.html':
            setupLoginForm();
            break;
        case 'cadastro.html':
            setupRegistrationForm();
            break;
        case 'ranking.html':
            loadRanking();
            break;
        case 'campeonatos.html':
            loadTournaments();
            break;
        case 'carteirinha.html':
            loadMemberCard();
            break;
        case 'admin.html':
            setupAdminDashboard();
            break;
        case 'admin-tournaments.html':
            setupAdminTournaments();
            break;
        case 'admin-users.html':
            setupAdminUsers();
            break;
        case 'admin-matches.html':
            setupAdminMatches();
            break;
    }
    
    // Verificar se o usuário está logado e atualizar a interface
    updateUserInterface();
}

// Função para carregar eventos próximos na página inicial
function loadUpcomingEvents() {
    const eventList = document.getElementById('event-list');
    if (!eventList) return;
    
    // Limpar mensagem de carregamento
    eventList.innerHTML = '';
    
    // Filtrar torneios futuros ou em andamento
    const upcomingTournaments = TOURNAMENTS.filter(tournament => 
        tournament.status === 'open' || tournament.status === 'upcoming'
    );
    
    if (upcomingTournaments.length === 0) {
        eventList.innerHTML = '<p class="no-events">Não há eventos programados no momento.</p>';
        return;
    }
    
    // Adicionar cada torneio à lista
    upcomingTournaments.forEach(tournament => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const startDate = new Date(tournament.startDate);
        const formattedDate = startDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        eventCard.innerHTML = `
            <img src="${tournament.image || 'img/default-tournament.jpg'}" alt="${tournament.title}">
            <div class="event-info">
                <p class="event-date">${formattedDate}</p>
                <h3 class="event-title">${tournament.title}</h3>
                <p>${tournament.description.substring(0, 100)}${tournament.description.length > 100 ? '...' : ''}</p>
                <a href="campeonatos.html?id=${tournament.id}" class="btn">Ver Detalhes</a>
            </div>
        `;
        
        eventList.appendChild(eventCard);
    });
}

// Função para configurar o formulário de login
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Verificar credenciais
        const user = USERS.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Salvar informações do usuário no localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo
            }));
            
            // Redirecionar com base no papel do usuário
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            showAlert('Email ou senha incorretos. Tente novamente.', 'error');
        }
    });
}

// Função para configurar o formulário de cadastro
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return;
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validações básicas
        if (password !== confirmPassword) {
            showAlert('As senhas não coincidem.', 'error');
            return;
        }
        
        // Verificar se o email já está em uso
        if (USERS.some(user => user.email === email)) {
            showAlert('Este email já está em uso.', 'error');
            return;
        }
        
        // Simular cadastro bem-sucedido
        const newUser = {
            id: USERS.length + 1,
            name: name,
            email: email,
            password: password,
            role: 'user',
            photo: 'img/default-user.jpg',
            points: 0,
            matches: 0,
            wins: 0
        };
        
        // Em uma aplicação real, enviaríamos para o servidor
        // Aqui apenas simulamos adicionando ao array
        USERS.push(newUser);
        
        showAlert('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
        
        // Redirecionar para a página de login após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// Função para carregar o ranking
function loadRanking() {
    const rankingTable = document.getElementById('ranking-table');
    if (!rankingTable) return;
    
    // Ordenar usuários por pontos (decrescente)
    const sortedUsers = [...USERS]
        .filter(user => user.role === 'user') // Excluir administradores
        .sort((a, b) => b.points - a.points);
    
    // Limpar tabela
    rankingTable.querySelector('tbody').innerHTML = '';
    
    // Adicionar cada usuário à tabela
    sortedUsers.forEach((user, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Adicionar classe para os 3 primeiros
        if (rank <= 3) {
            row.classList.add('top-3', `rank-${rank}`);
        }
        
        row.innerHTML = `
            <td class="rank-number">${rank}</td>
            <td>
                <div class="player-info">
                    <img src="${user.photo}" alt="${user.name}" class="player-avatar">
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.points}</td>
            <td>${user.matches}</td>
            <td>${user.wins}</td>
            <td>${user.matches > 0 ? Math.round((user.wins / user.matches) * 100) : 0}%</td>
        `;
        
        rankingTable.querySelector('tbody').appendChild(row);
    });
}

// Função para carregar os torneios
function loadTournaments() {
    const tournamentList = document.getElementById('tournament-list');
    if (!tournamentList) return;
    
    // Limpar lista
    tournamentList.innerHTML = '';
    
    // Verificar se estamos na página de detalhes de um torneio específico
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');
    
    if (tournamentId) {
        // Carregar detalhes de um torneio específico
        loadTournamentDetails(parseInt(tournamentId));
        return;
    }
    
    // Adicionar cada torneio à lista
    TOURNAMENTS.forEach(tournament => {
        const tournamentCard = document.createElement('div');
        tournamentCard.className = 'tournament-card';
        
        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);
        
        const formattedStartDate = startDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const formattedEndDate = endDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        let statusText, statusClass;
        switch(tournament.status) {
            case 'open':
                statusText = 'Inscrições Abertas';
                statusClass = 'status-open';
                break;
            case 'closed':
                statusText = 'Encerrado';
                statusClass = 'status-closed';
                break;
            case 'upcoming':
                statusText = 'Em Breve';
                statusClass = 'status-in-progress';
                break;
            default:
                statusText = 'Status Desconhecido';
                statusClass = '';
        }
        
        tournamentCard.innerHTML = `
            <div class="tournament-image">
                <img src="${tournament.image || 'img/default-tournament.jpg'}" alt="${tournament.title}">
                <span class="tournament-status ${statusClass}">${statusText}</span>
            </div>
            <div class="tournament-details">
                <p class="tournament-date">${formattedStartDate} - ${formattedEndDate}</p>
                <h3 class="tournament-title">${tournament.title}</h3>
                <div class="tournament-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${tournament.location}</p>
                    <p><i class="fas fa-users"></i> ${tournament.participants.length}/${tournament.maxParticipants} participantes</p>
                </div>
                <div class="tournament-actions">
                    <a href="campeonatos.html?id=${tournament.id}" class="btn">Ver Detalhes</a>
                    ${tournament.status === 'open' ? '<button class="btn btn-register">Inscrever-se</button>' : ''}
                </div>
            </div>
        `;
        
        tournamentList.appendChild(tournamentCard);
    });
    
    // Adicionar evento de clique para os botões de inscrição
    const registerButtons = document.querySelectorAll('.btn-register');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showAlert('Você precisa estar logado para se inscrever em um torneio.', 'error');
                return;
            }
            
            const tournamentCard = e.target.closest('.tournament-card');
            const tournamentId = parseInt(tournamentCard.querySelector('a').href.split('id=')[1]);
            
            registerForTournament(tournamentId, currentUser.id);
        });
    });
}

// Função para carregar detalhes de um torneio específico
function loadTournamentDetails(tournamentId) {
    const tournament = TOURNAMENTS.find(t => t.id === tournamentId);
    if (!tournament) {
        showAlert('Torneio não encontrado.', 'error');
        return;
    }
    
    const tournamentContainer = document.getElementById('tournament-container');
    if (!tournamentContainer) return;
    
    // Formatar datas
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    const formattedStartDate = startDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formattedEndDate = endDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Status do torneio
    let statusText, statusClass;
    switch(tournament.status) {
        case 'open':
            statusText = 'Inscrições Abertas';
            statusClass = 'status-open';
            break;
        case 'closed':
            statusText = 'Encerrado';
            statusClass = 'status-closed';
            break;
        case 'upcoming':
            statusText = 'Em Breve';
            statusClass = 'status-in-progress';
            break;
        default:
            statusText = 'Status Desconhecido';
            statusClass = '';
    }
    
    // Construir HTML dos detalhes do torneio
    tournamentContainer.innerHTML = `
        <div class="tournament-header">
            <div class="tournament-banner">
                <img src="${tournament.image || 'img/default-tournament.jpg'}" alt="${tournament.title}">
                <span class="tournament-status ${statusClass}">${statusText}</span>
            </div>
            <div class="tournament-title-container">
                <h2>${tournament.title}</h2>
                <p class="tournament-date"><i class="fas fa-calendar-alt"></i> ${formattedStartDate} - ${formattedEndDate}</p>
                <p class="tournament-location"><i class="fas fa-map-marker-alt"></i> ${tournament.location}</p>
            </div>
        </div>
        
        <div class="tournament-content">
            <div class="tournament-description">
                <h3>Sobre o Torneio</h3>
                <p>${tournament.description}</p>
                
                <div class="tournament-stats">
                    <div class="stat">
                        <span class="stat-value">${tournament.participants.length}/${tournament.maxParticipants}</span>
                        <span class="stat-label">Participantes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${getMatchesByTournament(tournament.id).length}</span>
                        <span class="stat-label">Partidas</span>
                    </div>
                </div>
                
                ${tournament.status === 'open' ? 
                    `<button id="register-btn" class="btn btn-large">Inscrever-se no Torneio</button>` : 
                    ''
                }
            </div>
            
            <div class="tournament-sidebar">
                <div class="tournament-section">
                    <h3>Participantes</h3>
                    <ul class="participants-list" id="participants-list">
                        ${tournament.participants.length === 0 ? 
                            '<li class="no-items">Nenhum participante inscrito ainda.</li>' : 
                            tournament.participants.map(userId => {
                                const user = USERS.find(u => u.id === userId);
                                return user ? `
                                    <li>
                                        <img src="${user.photo}" alt="${user.name}" class="participant-avatar">
                                        <span>${user.name}</span>
                                    </li>
                                ` : '';
                            }).join('')
                        }
                    </ul>
                </div>
                
                <div class="tournament-section">
                    <h3>Partidas</h3>
                    <ul class="matches-list" id="matches-list">
                        ${getMatchesByTournament(tournament.id).length === 0 ? 
                            '<li class="no-items">Nenhuma partida agendada ainda.</li>' : 
                            getMatchesByTournament(tournament.id).map(match => {
                                const player1 = USERS.find(u => u.id === match.player1);
                                const player2 = USERS.find(u => u.id === match.player2);
                                
                                return `
                                    <li class="match-item ${match.status}">
                                        <div class="match-players">
                                            <div class="player">
                                                <img src="${player1.photo}" alt="${player1.name}" class="player-avatar">
                                                <span>${player1.name}</span>
                                            </div>
                                            <div class="match-score">${match.score || 'vs'}</div>
                                            <div class="player">
                                                <img src="${player2.photo}" alt="${player2.name}" class="player-avatar">
                                                <span>${player2.name}</span>
                                            </div>
                                        </div>
                                        <div class="match-info">
                                            <span class="match-date">${new Date(match.date).toLocaleDateString('pt-BR')}</span>
                                            <span class="match-status">${match.status === 'completed' ? 'Concluída' : 'Agendada'}</span>
                                        </div>
                                    </li>
                                `;
                            }).join('')
                        }
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar evento ao botão de inscrição
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showAlert('Você precisa estar logado para se inscrever em um torneio.', 'error');
                return;
            }
            
            registerForTournament(tournament.id, currentUser.id);
        });
    }
}

// Função para obter partidas de um torneio específico
function getMatchesByTournament(tournamentId) {
    return MATCHES.filter(match => match.tournamentId === tournamentId);
}

// Função para inscrever um usuário em um torneio
function registerForTournament(tournamentId, userId) {
    const tournament = TOURNAMENTS.find(t => t.id === tournamentId);
    if (!tournament) {
        showAlert('Torneio não encontrado.', 'error');
        return;
    }
    
    // Verificar se o torneio está aberto para inscrições
    if (tournament.status !== 'open') {
        showAlert('Este torneio não está aberto para inscrições.', 'error');
        return;
    }
    
    // Verificar se o usuário já está inscrito
    if (tournament.participants.includes(userId)) {
        showAlert('Você já está inscrito neste torneio.', 'info');
        return;
    }
    
    // Verificar se o torneio atingiu o número máximo de participantes
    if (tournament.participants.length >= tournament.maxParticipants) {
        showAlert('Este torneio já atingiu o número máximo de participantes.', 'error');
        return;
    }
    
    // Adicionar usuário à lista de participantes
    tournament.participants.push(userId);
    
    showAlert('Inscrição realizada com sucesso!', 'success');
    
    // Atualizar a interface
    if (window.location.pathname.includes('campeonatos.html')) {
        loadTournamentDetails(tournamentId);
    }
}

// Função para carregar a carteirinha de membro
function loadMemberCard() {
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showAlert('Você precisa estar logado para visualizar sua carteirinha.', 'error');
        cardContainer.innerHTML = `
            <div class="alert alert-error">
                Você precisa estar logado para visualizar sua carteirinha.
                <a href="login.html" class="btn">Fazer Login</a>
            </div>
        `;
        return;
    }
    
    // Buscar informações completas do usuário
    const user = USERS.find(u => u.id === currentUser.id);
    if (!user) {
        showAlert('Usuário não encontrado.', 'error');
        return;
    }
    
    // Gerar código QR (simulado)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PINGAS-MEMBER-${user.id}`;
    
    // Construir HTML da carteirinha
    cardContainer.innerHTML = `
        <div class="member-card">
            <div class="card-header">
                <div class="card-logo">Pingas</div>
                <div class="card-title">Carteira de Membro</div>
            </div>
            <div class="card-body">
                <img src="${user.photo}" alt="${user.name}" class="member-photo">
                <div class="member-info">
                    <p><span class="info-label">Nome:</span> <span class="info-value">${user.name}</span></p>
                    <p><span class="info-label">ID:</span> <span class="info-value">#${user.id.toString().padStart(4, '0')}</span></p>
                    <p><span class="info-label">Ranking:</span> <span class="info-value">${getUserRanking(user.id)}</span></p>
                    <p><span class="info-label">Pontos:</span> <span class="info-value">${user.points}</span></p>
                </div>
                <div class="qr-code">
                    <img src="${qrCodeUrl}" alt="QR Code">
                </div>
            </div>
            <div class="card-footer">
                Válido até: ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('pt-BR')}
            </div>
        </div>
    `;
}

// Função para obter o ranking de um usuário
function getUserRanking(userId) {
    // Ordenar usuários por pontos (decrescente)
    const sortedUsers = [...USERS]
        .filter(user => user.role === 'user') // Excluir administradores
        .sort((a, b) => b.points - a.points);
    
    const userIndex = sortedUsers.findIndex(user => user.id === userId);
    return userIndex !== -1 ? userIndex + 1 : 'N/A';
}

// Funções para o painel administrativo
function setupAdminDashboard() {
    const adminContainer = document.getElementById('admin-container');
    if (!adminContainer) return;
    
    // Verificar se o usuário é administrador
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar estatísticas
    const totalUsers = USERS.filter(user => user.role === 'user').length;
    const totalTournaments = TOURNAMENTS.length;
    const activeTournaments = TOURNAMENTS.filter(t => t.status === 'open').length;
    const totalMatches = MATCHES.length;
    
    // Atualizar estatísticas no painel
    const statsContainer = document.getElementById('admin-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h4>Usuários</h4>
                    <p>${totalUsers}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                    <h4>Torneios</h4>
                    <p>${totalTournaments}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h4>Torneios Ativos</h4>
                    <p>${activeTournaments}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-table-tennis"></i>
                </div>
                <div class="stat-info">
                    <h4>Partidas</h4>
                    <p>${totalMatches}</p>
                </div>
            </div>
        `;
    }
    
    // Carregar torneios recentes
    const recentTournamentsContainer = document.getElementById('recent-tournaments');
    if (recentTournamentsContainer) {
        const recentTournaments = [...TOURNAMENTS].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5);
        
        recentTournamentsContainer.querySelector('tbody').innerHTML = recentTournaments.map(tournament => `
            <tr>
                <td>${tournament.title}</td>
                <td>${new Date(tournament.startDate).toLocaleDateString('pt-BR')}</td>
                <td>${tournament.participants.length}/${tournament.maxParticipants}</td>
                <td><span class="status-badge ${tournament.status}">${getStatusText(tournament.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <a href="admin-tournaments.html?edit=${tournament.id}" class="btn btn-sm btn-edit">Editar</a>
                        <button class="btn btn-sm btn-delete" data-id="${tournament.id}">Excluir</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Carregar partidas recentes
    const recentMatchesContainer = document.getElementById('recent-matches');
    if (recentMatchesContainer) {
        const recentMatches = [...MATCHES].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        recentMatchesContainer.querySelector('tbody').innerHTML = recentMatches.map(match => {
            const player1 = USERS.find(u => u.id === match.player1);
            const player2 = USERS.find(u => u.id === match.player2);
            const tournament = TOURNAMENTS.find(t => t.id === match.tournamentId);
            
            return `
                <tr>
                    <td>${player1.name} vs ${player2.name}</td>
                    <td>${tournament.title}</td>
                    <td>${new Date(match.date).toLocaleDateString('pt-BR')}</td>
                    <td>${match.score || 'Não realizada'}</td>
                    <td><span class="status-badge ${match.status}">${match.status === 'completed' ? 'Concluída' : 'Agendada'}</span></td>
                </tr>
            `;
        }).join('');
    }
}

// Função para configurar a página de administração de torneios
function setupAdminTournaments() {
    // Verificar se o usuário é administrador
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar se estamos editando um torneio existente
    const urlParams = new URLSearchParams(window.location.search);
    const editTournamentId = urlParams.get('edit');
    
    if (editTournamentId) {
        setupTournamentForm(parseInt(editTournamentId));
    } else {
        setupTournamentForm();
    }
    
    // Carregar lista de torneios
    loadAdminTournamentsList();
}

// Função para configurar o formulário de torneio
function setupTournamentForm(tournamentId = null) {
    const tournamentForm = document.getElementById('tournament-form');
    if (!tournamentForm) return;
    
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-tournament');
    
    let tournament = null;
    
    if (tournamentId) {
        // Modo de edição
        tournament = TOURNAMENTS.find(t => t.id === tournamentId);
        if (!tournament) {
            showAlert('Torneio não encontrado.', 'error');
            return;
        }
        
        formTitle.textContent = 'Editar Torneio';
        submitBtn.textContent = 'Atualizar Torneio';
        
        // Preencher o formulário com os dados do torneio
        document.getElementById('tournament-title').value = tournament.title;
        document.getElementById('tournament-description').value = tournament.description;
        document.getElementById('tournament-start-date').value = tournament.startDate;
        document.getElementById('tournament-end-date').value = tournament.endDate;
        document.getElementById('tournament-location').value = tournament.location;
        document.getElementById('tournament-max-participants').value = tournament.maxParticipants;
        document.getElementById('tournament-status').value = tournament.status;
    } else {
        // Modo de criação
        formTitle.textContent = 'Novo Torneio';
        submitBtn.textContent = 'Criar Torneio';
        tournamentForm.reset();
    }
    
    // Configurar evento de envio do formulário
    tournamentForm.onsubmit = function(e) {
        e.preventDefault();
        
        const title = document.getElementById('tournament-title').value;
        const description = document.getElementById('tournament-description').value;
        const startDate = document.getElementById('tournament-start-date').value;
        const endDate = document.getElementById('tournament-end-date').value;
        const location = document.getElementById('tournament-location').value;
        const maxParticipants = parseInt(document.getElementById('tournament-max-participants').value);
        const status = document.getElementById('tournament-status').value;
        
        if (tournamentId) {
            // Atualizar torneio existente
            tournament.title = title;
            tournament.description = description;
            tournament.startDate = startDate;
            tournament.endDate = endDate;
            tournament.location = location;
            tournament.maxParticipants = maxParticipants;
            tournament.status = status;
            
            showAlert('Torneio atualizado com sucesso!', 'success');
        } else {
            // Criar novo torneio
            const newTournament = {
                id: TOURNAMENTS.length + 1,
                title,
                description,
                startDate,
                endDate,
                location,
                status,
                maxParticipants,
                participants: [],
                image: 'img/default-tournament.jpg'
            };
            
            TOURNAMENTS.push(newTournament);
            showAlert('Torneio criado com sucesso!', 'success');
        }
        
        // Atualizar a lista de torneios
        loadAdminTournamentsList();
        
        // Limpar o formulário
        tournamentForm.reset();
        
        // Se estávamos editando, voltar para o modo de criação
        if (tournamentId) {
            window.history.pushState({}, '', 'admin-tournaments.html');
            formTitle.textContent = 'Novo Torneio';
            submitBtn.textContent = 'Criar Torneio';
        }
    };
}

// Função para carregar a lista de torneios no painel administrativo
function loadAdminTournamentsList() {
    const tournamentsList = document.getElementById('tournaments-list');
    if (!tournamentsList) return;
    
    tournamentsList.innerHTML = '';
    
    TOURNAMENTS.forEach(tournament => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
                        <td>${tournament.title}</td>
            <td>${new Date(tournament.startDate).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(tournament.endDate).toLocaleDateString('pt-BR')}</td>
            <td>${tournament.participants.length}/${tournament.maxParticipants}</td>
            <td><span class="status-badge ${tournament.status}">${getStatusText(tournament.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <a href="admin-tournaments.html?edit=${tournament.id}" class="btn btn-sm btn-edit">Editar</a>
                    <button class="btn btn-sm btn-delete delete-tournament" data-id="${tournament.id}">Excluir</button>
                </div>
            </td>
        `;
        
        tournamentsList.appendChild(row);
    });
    
    // Adicionar eventos aos botões de exclusão
    const deleteButtons = document.querySelectorAll('.delete-tournament');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tournamentId = parseInt(this.getAttribute('data-id'));
            deleteTournament(tournamentId);
        });
    });
}

// Função para excluir um torneio
function deleteTournament(tournamentId) {
    if (!confirm('Tem certeza que deseja excluir este torneio? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const tournamentIndex = TOURNAMENTS.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
        showAlert('Torneio não encontrado.', 'error');
        return;
    }
    
    // Remover torneio do array
    TOURNAMENTS.splice(tournamentIndex, 1);
    
    // Remover partidas associadas ao torneio
    const matchesToRemove = MATCHES.filter(match => match.tournamentId === tournamentId);
    matchesToRemove.forEach(match => {
        const matchIndex = MATCHES.findIndex(m => m.id === match.id);
        if (matchIndex !== -1) {
            MATCHES.splice(matchIndex, 1);
        }
    });
    
    showAlert('Torneio excluído com sucesso!', 'success');
    
    // Atualizar a lista de torneios
    loadAdminTournamentsList();
}

// Função para configurar a página de administração de usuários
// Função para configurar a página de administração de usuários
function setupAdminUsers() {
    // Verificar se o usuário é administrador
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar lista de usuários
    loadAdminUsersList();
    
    // Configurar formulário de usuário
    setupUserForm();
}

// Função para configurar o formulário de usuário
function setupUserForm(userId = null) {
    const userForm = document.getElementById('user-form');
    if (!userForm) return;
    
    const submitBtn = document.getElementById('submit-user');
    
    let user = null;
    
    if (userId) {
        // Modo de edição
        user = USERS.find(u => u.id === userId);
        if (!user) {
            showAlert('Usuário não encontrado.', 'error');
            return;
        }
        
        submitBtn.textContent = 'Atualizar Usuário';
        
        // Preencher o formulário com os dados do usuário
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = user.password;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-points').value = user.points;
        document.getElementById('user-matches').value = user.matches;
        document.getElementById('user-wins').value = user.wins;
    } else {
        // Modo de criação
        submitBtn.textContent = 'Criar Usuário';
        userForm.reset();
        document.getElementById('user-points').value = 0;
        document.getElementById('user-matches').value = 0;
        document.getElementById('user-wins').value = 0;
    }
    
    // Configurar evento de envio do formulário
    userForm.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const role = document.getElementById('user-role').value;
        const points = parseInt(document.getElementById('user-points').value);
        const matches = parseInt(document.getElementById('user-matches').value);
        const wins = parseInt(document.getElementById('user-wins').value);
        
        // Validar email único
        const emailExists = USERS.some(u => u.email === email && (!userId || u.id !== userId));
        if (emailExists) {
            showAlert('Este email já está em uso.', 'error');
            return;
        }
        
        if (userId) {
            // Atualizar usuário existente
            user.name = name;
            user.email = email;
            user.password = password;
            user.role = role;
            user.points = points;
            user.matches = matches;
            user.wins = wins;
            
            showAlert('Usuário atualizado com sucesso!', 'success');
        } else {
            // Criar novo usuário
            const newUser = {
                id: USERS.length + 1,
                name,
                email,
                password,
                role,
                photo: 'img/default-user.jpg', // Foto padrão
                points,
                matches,
                wins
            };
            
            USERS.push(newUser);
            
            showAlert('Usuário criado com sucesso!', 'success');
        }
        
        // Atualizar a lista de usuários
        loadAdminUsersList();
        
        // Limpar o formulário
        userForm.reset();
        document.getElementById('user-points').value = 0;
        document.getElementById('user-matches').value = 0;
        document.getElementById('user-wins').value = 0;
        
        // Se estávamos editando, voltar para o modo de criação
        if (userId) {
            submitBtn.textContent = 'Criar Usuário';
        }
    };
}

// Função para carregar a lista de usuários no painel administrativo
function loadAdminUsersList() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    USERS.forEach(user => {
        // Não mostrar o usuário atual (admin) na lista
        const currentUser = getCurrentUser();
        if (currentUser && user.id === currentUser.id) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <img src="${user.photo}" alt="${user.name}" class="user-avatar">
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
            <td>${user.points}</td>
            <td>${user.matches}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit edit-user" data-id="${user.id}">Editar</button>
                    <button class="btn btn-sm btn-delete delete-user" data-id="${user.id}">Excluir</button>
                </div>
            </td>
        `;
        
        usersList.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    const editButtons = document.querySelectorAll('.edit-user');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            setupUserForm(userId);
        });
    });
    
    const deleteButtons = document.querySelectorAll('.delete-user');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

// Função para excluir um usuário
function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        showAlert('Usuário não encontrado.', 'error');
        return;
    }
    
    // Remover usuário do array
    USERS.splice(userIndex, 1);
    
    // Remover usuário de torneios
    TOURNAMENTS.forEach(tournament => {
        const participantIndex = tournament.participants.indexOf(userId);
        if (participantIndex !== -1) {
            tournament.participants.splice(participantIndex, 1);
        }
    });
    
    // Remover partidas associadas ao usuário
    const matchesToRemove = MATCHES.filter(match => match.player1 === userId || match.player2 === userId);
    matchesToRemove.forEach(match => {
        const matchIndex = MATCHES.findIndex(m => m.id === match.id);
        if (matchIndex !== -1) {
            MATCHES.splice(matchIndex, 1);
        }
    });
    
    showAlert('Usuário excluído com sucesso!', 'success');
    
    // Atualizar lista de usuários
    loadAdminUsersList();
}

// Função para carregar a lista de usuários no painel administrativo
function loadAdminUsersList() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    USERS.filter(user => user.id !== 5).forEach(user => { // Excluir o próprio admin da lista
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <img src="${user.photo}" alt="${user.name}" class="user-avatar">
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
            <td>${user.points}</td>
            <td>${user.matches}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit edit-user" data-id="${user.id}">Editar</button>
                    <button class="btn btn-sm btn-delete delete-user" data-id="${user.id}">Excluir</button>
                </div>
            </td>
        `;
        
        usersList.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    const editButtons = document.querySelectorAll('.edit-user');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            openUserEditModal(userId);
        });
    });
    
    const deleteButtons = document.querySelectorAll('.delete-user');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

// Função para abrir modal de edição de usuário
function openUserEditModal(userId) {
    const user = USERS.find(u => u.id === userId);
    if (!user) {
        showAlert('Usuário não encontrado.', 'error');
        return;
    }
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Editar Usuário</h2>
            <form id="edit-user-form">
                <div class="form-group">
                    <label for="edit-name">Nome</label>
                    <input type="text" id="edit-name" class="form-control" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" class="form-control" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="edit-role">Função</label>
                    <select id="edit-role" class="form-control">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-points">Pontos</label>
                    <input type="number" id="edit-points" class="form-control" value="${user.points}" min="0">
                </div>
                <div class="form-group">
                    <label for="edit-matches">Partidas</label>
                    <input type="number" id="edit-matches" class="form-control" value="${user.matches}" min="0">
                </div>
                <div class="form-group">
                    <label for="edit-wins">Vitórias</label>
                    <input type="number" id="edit-wins" class="form-control" value="${user.wins}" min="0">
                </div>
                <div class="form-footer">
                    <button type="submit" class="btn">Salvar Alterações</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar eventos do modal
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Configurar envio do formulário
    const editForm = document.getElementById('edit-user-form');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Atualizar dados do usuário
        user.name = document.getElementById('edit-name').value;
        user.email = document.getElementById('edit-email').value;
        user.role = document.getElementById('edit-role').value;
        user.points = parseInt(document.getElementById('edit-points').value);
        user.matches = parseInt(document.getElementById('edit-matches').value);
        user.wins = parseInt(document.getElementById('edit-wins').value);
        
        showAlert('Usuário atualizado com sucesso!', 'success');
        
        // Fechar modal
        document.body.removeChild(modal);
        
        // Atualizar lista de usuários
        loadAdminUsersList();
    });
}

// Função para excluir um usuário
function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        showAlert('Usuário não encontrado.', 'error');
        return;
    }
    
    // Remover usuário do array
    USERS.splice(userIndex, 1);
    
    // Remover usuário de torneios
    TOURNAMENTS.forEach(tournament => {
        const participantIndex = tournament.participants.indexOf(userId);
        if (participantIndex !== -1) {
            tournament.participants.splice(participantIndex, 1);
        }
    });
    
    // Remover partidas associadas ao usuário
    const matchesToRemove = MATCHES.filter(match => match.player1 === userId || match.player2 === userId);
    matchesToRemove.forEach(match => {
        const matchIndex = MATCHES.findIndex(m => m.id === match.id);
        if (matchIndex !== -1) {
            MATCHES.splice(matchIndex, 1);
        }
    });
    
    showAlert('Usuário excluído com sucesso!', 'success');
    
    // Atualizar lista de usuários
    loadAdminUsersList();
}

// Função para configurar a página de administração de partidas
function setupAdminMatches() {
    // Verificar se o usuário é administrador
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar se estamos editando uma partida existente
    const urlParams = new URLSearchParams(window.location.search);
    const editMatchId = urlParams.get('edit');
    
    if (editMatchId) {
        setupMatchForm(parseInt(editMatchId));
    } else {
        setupMatchForm();
    }
    
    // Carregar lista de partidas
    loadAdminMatchesList();
}

// Função para configurar o formulário de partida
function setupMatchForm(matchId = null) {
    const matchForm = document.getElementById('match-form');
    if (!matchForm) return;
    
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-match');
    
    let match = null;
    
    // Preencher select de torneios
    const tournamentSelect = document.getElementById('match-tournament');
    tournamentSelect.innerHTML = '<option value="">Selecione um torneio</option>';
    
    TOURNAMENTS.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament.id;
        option.textContent = tournament.title;
        tournamentSelect.appendChild(option);
    });
    
    // Configurar evento de mudança do torneio para atualizar os jogadores disponíveis
    tournamentSelect.addEventListener('change', function() {
        updatePlayerSelects();
    });
    
    if (matchId) {
        // Modo de edição
        match = MATCHES.find(m => m.id === matchId);
        if (!match) {
            showAlert('Partida não encontrada.', 'error');
            return;
        }
        
        formTitle.textContent = 'Editar Partida';
        submitBtn.textContent = 'Atualizar Partida';
        
        // Preencher o formulário com os dados da partida
        document.getElementById('match-tournament').value = match.tournamentId;
        updatePlayerSelects(match.player1, match.player2);
        document.getElementById('match-date').value = match.date;
        document.getElementById('match-status').value = match.status;
        document.getElementById('match-score').value = match.score;
    } else {
        // Modo de criação
        formTitle.textContent = 'Nova Partida';
        submitBtn.textContent = 'Criar Partida';
        matchForm.reset();
        updatePlayerSelects();
    }
    
    // Configurar evento de envio do formulário
    matchForm.onsubmit = function(e) {
        e.preventDefault();
        
        const tournamentId = parseInt(document.getElementById('match-tournament').value);
        const player1 = parseInt(document.getElementById('match-player1').value);
        const player2 = parseInt(document.getElementById('match-player2').value);
        const date = document.getElementById('match-date').value;
        const status = document.getElementById('match-status').value;
        const score = document.getElementById('match-score').value;
        
        // Validações básicas
        if (player1 === player2) {
            showAlert('Os jogadores devem ser diferentes.', 'error');
            return;
        }
        
        if (matchId) {
            // Atualizar partida existente
            match.tournamentId = tournamentId;
            match.player1 = player1;
            match.player2 = player2;
            match.date = date;
            match.status = status;
            match.score = score;
            
            // Se a partida foi concluída, atualizar estatísticas dos jogadores
            if (status === 'completed' && match.status !== 'completed') {
                updatePlayerStats(player1, player2, score);
            }
            
            showAlert('Partida atualizada com sucesso!', 'success');
        } else {
            // Criar nova partida
            const newMatch = {
                id: MATCHES.length + 1,
                tournamentId,
                player1,
                player2,
                date,
                status,
                score
            };
            
            MATCHES.push(newMatch);
            
            // Se a partida já foi concluída, atualizar estatísticas dos jogadores
            if (status === 'completed') {
                updatePlayerStats(player1, player2, score);
            }
            
            showAlert('Partida criada com sucesso!', 'success');
        }
        
        // Atualizar a lista de partidas
        loadAdminMatchesList();
        
        // Limpar o formulário
        matchForm.reset();
        updatePlayerSelects();
        
        // Se estávamos editando, voltar para o modo de criação
        if (matchId) {
            window.history.pushState({}, '', 'admin-matches.html');
            formTitle.textContent = 'Nova Partida';
            submitBtn.textContent = 'Criar Partida';
        }
    };
}

// Função para atualizar os selects de jogadores com base no torneio selecionado
function updatePlayerSelects(selectedPlayer1 = null, selectedPlayer2 = null) {
    const tournamentId = parseInt(document.getElementById('match-tournament').value);
    const player1Select = document.getElementById('match-player1');
    const player2Select = document.getElementById('match-player2');
    
    // Limpar selects
    player1Select.innerHTML = '<option value="">Selecione o jogador 1</option>';
    player2Select.innerHTML = '<option value="">Selecione o jogador 2</option>';
    
    if (!tournamentId) return;
    
    const tournament = TOURNAMENTS.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    // Adicionar participantes do torneio aos selects
    tournament.participants.forEach(userId => {
        const user = USERS.find(u => u.id === userId);
        if (!user) return;
        
        const option1 = document.createElement('option');
        option1.value = user.id;
        option1.textContent = user.name;
        if (selectedPlayer1 && user.id === selectedPlayer1) {
            option1.selected = true;
        }
        player1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = user.id;
        option2.textContent = user.name;
        if (selectedPlayer2 && user.id === selectedPlayer2) {
            option2.selected = true;
        }
        player2Select.appendChild(option2);
    });
}

// Função para atualizar estatísticas dos jogadores após uma partida
function updatePlayerStats(player1Id, player2Id, score) {
    const player1 = USERS.find(u => u.id === player1Id);
    const player2 = USERS.find(u => u.id === player2Id);
    
    if (!player1 || !player2 || !score) return;
    
    // Incrementar número de partidas
    player1.matches++;
    player2.matches++;
    
    // Determinar o vencedor e atualizar estatísticas
    const scores = score.split('-').map(s => parseInt(s));
    if (scores.length !== 2) return;
    
    if (scores[0] > scores[1]) {
        // Jogador 1 venceu
        player1.wins++;
        player1.points += 10; // Pontos por vitória
        player2.points += 2;  // Pontos por participação
    } else if (scores[1] > scores[0]) {
        // Jogador 2 venceu
        player2.wins++;
        player2.points += 10; // Pontos por vitória
        player1.points += 2;  // Pontos por participação
    } else {
        // Empate (improvável no tênis de mesa, mas por precaução)
        player1.points += 5;
        player2.points += 5;
    }
}

// Função para carregar a lista de partidas no painel administrativo
function loadAdminMatchesList() {
    const matchesList = document.getElementById('matches-list');
    if (!matchesList) return;
    
    matchesList.innerHTML = '';
    
    MATCHES.forEach(match => {
        const player1 = USERS.find(u => u.id === match.player1);
        const player2 = USERS.find(u => u.id === match.player2);
        const tournament = TOURNAMENTS.find(t => t.id === match.tournamentId);
        
        if (!player1 || !player2 || !tournament) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${player1.name} vs ${player2.name}</td>
            <td>${tournament.title}</td>
            <td>${new Date(match.date).toLocaleDateString('pt-BR')}</td>
            <td>${match.score || 'Não realizada'}</td>
            <td><span class="status-badge ${match.status}">${match.status === 'completed' ? 'Concluída' : 'Agendada'}</span></td>
            <td>
                <div class="action-buttons">
                    <a href="admin-matches.html?edit=${match.id}" class="btn btn-sm btn-edit">Editar</a>
                    <button class="btn btn-sm btn-delete delete-match" data-id="${match.id}">Excluir</button>
                </div>
            </td>
        `;
        
        matchesList.appendChild(row);
    });
    
    // Adicionar eventos aos botões de exclusão
    const deleteButtons = document.querySelectorAll('.delete-match');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchId = parseInt(this.getAttribute('data-id'));
            deleteMatch(matchId);
        });
    });
}

// Função para excluir uma partida
function deleteMatch(matchId) {
    if (!confirm('Tem certeza que deseja excluir esta partida? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const matchIndex = MATCHES.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
        showAlert('Partida não encontrada.', 'error');
        return;
    }
    
    // Remover partida do array
    MATCHES.splice(matchIndex, 1);
    
    showAlert('Partida excluída com sucesso!', 'success');
    
    // Atualizar a lista de partidas
    loadAdminMatchesList();
}

// Função para obter o texto do status
function getStatusText(status) {
    switch(status) {
        case 'open':
            return 'Inscrições Abertas';
        case 'closed':
            return 'Encerrado';
        case 'upcoming':
            return 'Em Breve';
        default:
            return 'Status Desconhecido';
    }
}

// Função para obter o usuário atual
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Função para atualizar a interface com base no usuário logado
function updateUserInterface() {
    const currentUser = getCurrentUser();
    const loginBtn = document.querySelector('.btn-login');
    const cadastroBtn = document.querySelector('.btn-cadastro');
    
    if (currentUser) {
        // Usuário logado
        if (loginBtn && cadastroBtn) {
            // Substituir botões de login/cadastro por menu do usuário
            const nav = loginBtn.parentElement.parentElement;
            
            // Remover botões existentes
            loginBtn.parentElement.remove();
            cadastroBtn.parentElement.remove();
            
            // Adicionar menu do usuário
            const userMenuItem = document.createElement('li');
            userMenuItem.className = 'user-menu';
            userMenuItem.innerHTML = `
                <a href="#" class="user-menu-toggle">
                    <img src="${currentUser.photo}" alt="${currentUser.name}" class="user-avatar">
                    <span>${currentUser.name}</span>
                </a>
                <ul class="user-dropdown">
                    <li><a href="carteirinha.html">Minha Carteirinha</a></li>
                    <li><a href="minhas-partidas.html">Minhas Partidas</a></li>
                    ${currentUser.role === 'admin' ? '<li><a href="admin.html">Painel Administrativo</a></li>' : ''}
                    <li><a href="#" id="logout-btn">Sair</a></li>
                </ul>
            `;
            
            nav.appendChild(userMenuItem);
            
            // Configurar evento de clique para o menu do usuário
            const userMenuToggle = userMenuItem.querySelector('.user-menu-toggle');
            userMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                userMenuItem.classList.toggle('active');
            });
            
            // Configurar evento de clique para o botão de logout
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('currentUser');
    showAlert('Logout realizado com sucesso!', 'success');
    
    // Redirecionar para a página inicial
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Função para exibir alertas
function showAlert(message, type = 'info') {
    // Verificar se já existe um alerta
    const existingAlert = document.querySelector('.alert-popup');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `alert-popup ${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Configurar evento de clique para fechar o alerta
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(alert);
    });
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        if (document.body.contains(alert)) {
            document.body.removeChild(alert);
        }
    }, 5000);
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initPage);