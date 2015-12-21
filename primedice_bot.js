var Primedice = require('primedice');
var colors = require('colors/safe');

var accessToken = 'accessToken';
var authedClient = new Primedice(accessToken);

var G_base_bet = 1;
var G_bet_size = 1;
var Payout_Under = '<';
var Payout_Over = '>';
var Under = 49.50;
var Over = 50.49;
var OverUnder = 49.50;
var Arrow = '<';

var Total_roll = 0;
var roll_number = 0;

var Total_losses = 0;

var waitfunction = function() {
	//	if ((Total_roll / roll_number) > 49.50)
	//	{OverUnder = 49.50;
	//		Arrow = '>';}
	//	else {OverUnder = 50.49;
	//		Arrow = '<';}
	//
	if ((Total_losses >= 25)) {
		G_bet_size = 100;
		authedClient.bet(100, 9.90, '<', Bet);
	}

	else if ((Total_losses > 15) && (Total_losses < 25)) {
		G_bet_size = 10;
		authedClient.bet(10, 9.90, '<', Bet);
	}
	else{
		G_bet_size = 0;
		authedClient.bet(0, 9.90, '<', Bet);
	}};

var GetBalance = function(error, response) {
	if (!error){
		console.log("Balance is: ", response.user.balance);
	}
};

var Bet = function(error, response) {
	if (!error){
		balance = response.user.balance;
		outcome = response.bet.win;
		condition = response.bet.condition;
		roll = response.bet.roll;
		Total_roll += roll; 		
		roll_number += 1;
		if (roll_number > 2) {
			Total_roll = roll;
			roll_number = 1;

		}		
		if (balance > 50000) {
			process.exit();
		}

		if (balance < 1000) {

			process.exit();
		}



		if (outcome === true) {
			Total_losses = 0;
			//authedClient.users(GetBalance);
			console.log(colors.green("Bet ", G_bet_size, " and won!"), " Balance is: ", balance, "Condition: ", condition, " Roll: ", roll, " Avg Roll: ", (Total_roll / roll_number));

			G_bet_size = G_base_bet;

			setTimeout(waitfunction, 450);
		}

		if (outcome === false) {
			Total_losses = (Total_losses + 1);
			//authedClient.users(GetBalance);
			console.log(colors.red("Bet ", G_bet_size, " and lost"), " Balance is: ", balance, "Condition: ", condition, " Roll: ", roll, " Avg Roll: ", (Total_roll / roll_number));


			//G_bet_size = (G_bet_size*2);
			//if (G_bet_size > 3200 ) {
			//process.exit();
			//	;}

			setTimeout (waitfunction, 450);
		}

		//console.log(response.bet);
	}
	else {console.log(error);}

};



authedClient.bet(G_base_bet, Under, Payout_Under, Bet);
