from services.anthropic_service_for_prisoners_dilemma import get_agent_decision

def play_game(game_parameters):
    # Get decisions from agents
    agent_a_decision = get_agent_decision(game_parameters, agent='A')
    agent_b_decision = get_agent_decision(game_parameters, agent='B')
    
    # Determine payoffs
    payoff_matrix = {
        ('Cooperate', 'Cooperate'): (3, 3),
        ('Cooperate', 'Defect'): (0, 5),
        ('Defect', 'Cooperate'): (5, 0),
        ('Defect', 'Defect'): (1, 1),
    }
    payoffs = payoff_matrix[(agent_a_decision, agent_b_decision)]
    
    # Save result to DB (not shown)
    
    return {
        'agent_a_decision': agent_a_decision,
        'agent_b_decision': agent_b_decision,
        'payoffs': payoffs
    }
