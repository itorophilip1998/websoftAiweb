// Football Prediction Service for Websoft AI
export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  prediction: string;
  confidence: number;
  reasoning: string;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
  keyFactors: string[];
}

export interface TeamStats {
  team: string;
  form: string[];
  goalsScored: number;
  goalsConceded: number;
  homeAdvantage: number;
  recentPerformance: string;
}

export class FootballPredictionService {
  private leagues = [
    "Premier League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "Ligue 1",
    "Champions League",
    "Europa League",
    "World Cup",
    "Euro Cup",
  ];

  private teams = {
    "Premier League": [
      "Manchester City",
      "Arsenal",
      "Manchester United",
      "Liverpool",
      "Chelsea",
      "Tottenham",
      "Newcastle",
      "Brighton",
      "Aston Villa",
      "West Ham",
    ],
    "La Liga": [
      "Real Madrid",
      "Barcelona",
      "Atletico Madrid",
      "Sevilla",
      "Villarreal",
      "Real Sociedad",
      "Athletic Bilbao",
      "Valencia",
      "Real Betis",
      "Girona",
    ],
    Bundesliga: [
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig",
      "Bayer Leverkusen",
      "VfB Stuttgart",
      "Eintracht Frankfurt",
      "Hoffenheim",
      "Freiburg",
    ],
  };

  // Generate today's predictions
  generateTodayPredictions(): MatchPrediction[] {
    const today = new Date();
    const predictions: MatchPrediction[] = [];

    // Generate 3-5 matches for today
    const numMatches = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numMatches; i++) {
      const league =
        this.leagues[Math.floor(Math.random() * this.leagues.length)];
      const leagueTeams = this.teams[league] || this.teams["Premier League"];

      const homeTeam =
        leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      let awayTeam =
        leagueTeams[Math.floor(Math.random() * leagueTeams.length)];

      // Ensure different teams
      while (awayTeam === homeTeam) {
        awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      }

      const prediction = this.generateMatchPrediction(
        homeTeam,
        awayTeam,
        league
      );
      predictions.push(prediction);
    }

    return predictions;
  }

  // Generate prediction for a specific match
  generateMatchPrediction(
    homeTeam: string,
    awayTeam: string,
    league: string
  ): MatchPrediction {
    const homeStats = this.generateTeamStats(homeTeam, true);
    const awayStats = this.generateTeamStats(awayTeam, false);

    // Analyze and predict
    const homeStrength = this.calculateTeamStrength(homeStats);
    const awayStrength = this.calculateTeamStrength(awayStats);

    let prediction: string;
    let confidence: number;
    let reasoning: string;

    if (homeStrength > awayStrength + 0.3) {
      prediction = "Home Win";
      confidence = Math.min(85, 70 + (homeStrength - awayStrength) * 50);
      reasoning = `${homeTeam} has strong home form and superior recent performance`;
    } else if (awayStrength > homeStrength + 0.3) {
      prediction = "Away Win";
      confidence = Math.min(80, 65 + (awayStrength - homeStrength) * 50);
      reasoning = `${awayTeam} is in excellent form and has been performing well away from home`;
    } else {
      prediction = "Draw";
      confidence = Math.min(
        75,
        60 + Math.abs(homeStrength - awayStrength) * 30
      );
      reasoning =
        "Both teams are evenly matched with similar form and performance levels";
    }

    const odds = this.calculateOdds(prediction, confidence);
    const keyFactors = this.identifyKeyFactors(homeStats, awayStats);

    return {
      homeTeam,
      awayTeam,
      league,
      date: new Date().toLocaleDateString(),
      prediction,
      confidence: Math.round(confidence),
      reasoning,
      odds,
      keyFactors,
    };
  }

  // Generate team statistics
  private generateTeamStats(team: string, isHome: boolean): TeamStats {
    const formResults = ["W", "D", "L", "W", "W", "D", "L", "W", "D", "W"];
    const form = formResults.slice(0, Math.floor(Math.random() * 5) + 5);

    const goalsScored = Math.floor(Math.random() * 30) + 20;
    const goalsConceded = Math.floor(Math.random() * 25) + 15;
    const homeAdvantage = isHome ? Math.random() * 0.3 + 0.1 : 0;

    const performances = [
      "Excellent attacking form",
      "Solid defensive record",
      "Inconsistent but dangerous",
      "Strong home/away record",
      "Struggling with injuries",
      "Peaking at the right time",
    ];

    return {
      team,
      form,
      goalsScored,
      goalsConceded,
      homeAdvantage,
      recentPerformance:
        performances[Math.floor(Math.random() * performances.length)],
    };
  }

  // Calculate team strength based on stats
  private calculateTeamStrength(stats: TeamStats): number {
    let strength = 0.5; // Base strength

    // Form factor
    const formScore = stats.form.reduce((score, result) => {
      if (result === "W") return score + 0.1;
      if (result === "D") return score + 0.05;
      return score - 0.05;
    }, 0);

    // Goals factor
    const goalDifference = (stats.goalsScored - stats.goalsConceded) / 20;

    // Home advantage
    strength += stats.homeAdvantage;
    strength += formScore * 0.2;
    strength += goalDifference * 0.1;

    return Math.max(0.1, Math.min(1.0, strength));
  }

  // Calculate betting odds
  private calculateOdds(
    prediction: string,
    confidence: number
  ): { home: number; draw: number; away: number } {
    const baseOdds = {
      home: 2.5,
      draw: 3.2,
      away: 2.8,
    };

    if (prediction === "Home Win") {
      return {
        home: baseOdds.home * (1 - confidence / 100),
        draw: baseOdds.draw * (1 + confidence / 100),
        away: baseOdds.away * (1 + confidence / 100),
      };
    } else if (prediction === "Away Win") {
      return {
        home: baseOdds.home * (1 + confidence / 100),
        draw: baseOdds.draw * (1 + confidence / 100),
        away: baseOdds.away * (1 - confidence / 100),
      };
    } else {
      return {
        home: baseOdds.home * (1 + confidence / 100),
        draw: baseOdds.draw * (1 - confidence / 100),
        away: baseOdds.away * (1 + confidence / 100),
      };
    }
  }

  // Identify key factors for the prediction
  private identifyKeyFactors(
    homeStats: TeamStats,
    awayStats: TeamStats
  ): string[] {
    const factors: string[] = [];

    if (homeStats.form.filter((f) => f === "W").length >= 3) {
      factors.push(`${homeStats.team} in excellent form`);
    }

    if (awayStats.form.filter((f) => f === "L").length >= 2) {
      factors.push(`${awayStats.team} struggling away from home`);
    }

    if (homeStats.goalsScored > 25) {
      factors.push(`${homeStats.team} scoring freely`);
    }

    if (awayStats.goalsConceded > 20) {
      factors.push(`${awayStats.team} defensive vulnerabilities`);
    }

    if (homeStats.homeAdvantage > 0.2) {
      factors.push("Strong home advantage");
    }

    return factors.slice(0, 3); // Return top 3 factors
  }

  // Get upcoming matches
  getUpcomingMatches(): string[] {
    const upcoming = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const league =
        this.leagues[Math.floor(Math.random() * this.leagues.length)];
      const leagueTeams = this.teams[league] || this.teams["Premier League"];

      const homeTeam =
        leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      let awayTeam =
        leagueTeams[Math.floor(Math.random() * leagueTeams.length)];

      while (awayTeam === homeTeam) {
        awayTeam = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
      }

      upcoming.push(
        `${date.toLocaleDateString()}: ${homeTeam} vs ${awayTeam} (${league})`
      );
    }

    return upcoming;
  }

  // Get league standings
  getLeagueStandings(league: string): any[] {
    const leagueTeams = this.teams[league] || this.teams["Premier League"];
    const standings = leagueTeams.map((team, index) => ({
      position: index + 1,
      team,
      played: Math.floor(Math.random() * 10) + 20,
      won: Math.floor(Math.random() * 15) + 5,
      drawn: Math.floor(Math.random() * 8) + 2,
      lost: Math.floor(Math.random() * 10) + 1,
      goalsFor: Math.floor(Math.random() * 30) + 20,
      goalsAgainst: Math.floor(Math.random() * 25) + 15,
      points: 0,
    }));

    // Calculate points and sort
    standings.forEach((team) => {
      team.points = team.won * 3 + team.drawn;
    });

    return standings.sort((a, b) => b.points - a.points);
  }
}

export default FootballPredictionService;
