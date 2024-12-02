import { pad_number, ADVENT_CALENDER_DAYS } from "./util.js";

const AOC_START_EPOCH_MILLIS = 1733029200000;

const DAY_IN_MILLISECONDS  = 1000*60*60*24;
const HOUR_IN_MILLISECONDS = 1000*60*60;
const MINUTE_IN_MILLISECONDS = 1000*60;
const SECOND_IN_MILLISECONDS = 1000;



export class Time_Keeper {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * singleton pattern for our time keeper
     * @returns the time keeper instance
     */
    static get_instance(){
        return time_keeper_instance;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor(){
        /**
         * when the advent of code started this year
         */
        this.date_first_challenge_released = new Date();
        this.date_first_challenge_released.setTime(AOC_START_EPOCH_MILLIS);


        // first update
        this.update_timer();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * update the timer
     */
    update_timer(){
        /**
         * last update of the timer
         */
        this.now = Date.now();

        /**
         * time since the first challenge
         */
        this.time_since_first = this.now - this.date_first_challenge_released;

        /**
         * number of full days since the first
         */
        this.days_since_first_challenge = Math.floor(this.time_since_first / DAY_IN_MILLISECONDS);

        // when all of them are available
        if(this.get_number_of_challenges_available() >= ADVENT_CALENDER_DAYS){
            this.current_day_elapsed_milliseconds = 0;
            this.milliseconds_left_before_next = 0;
        }
        else {
            /**
             * time in milliseconds we've been on the current day
             */
            this.current_day_elapsed_milliseconds = this.time_since_first % DAY_IN_MILLISECONDS;
    
            // give back the number of milliseconds we have left in the day
            this.milliseconds_left_before_next = DAY_IN_MILLISECONDS - this.current_day_elapsed_milliseconds;
        }

    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_number_of_challenges_available(){
        return Math.min((this.days_since_first_challenge+1), ADVENT_CALENDER_DAYS);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_millis_till_next_challenge(){
        return this.milliseconds_left_before_next;
    }
    get_hours_till_next_challenge(){
        return Math.floor(this.milliseconds_left_before_next / HOUR_IN_MILLISECONDS) % 24;
    }
    get_minutes_till_next_challenge(){
        return Math.floor(this.milliseconds_left_before_next / MINUTE_IN_MILLISECONDS) % 60;
    }
    get_seconds_till_next_challenge(){
        return Math.floor(this.milliseconds_left_before_next / SECOND_IN_MILLISECONDS) % 60;
    }

    /**
     * constructs a clock string of time left until next challenge in the format of HH:MM:SS
     * @returns clock string
     */
    get_time_string_till_next_challenge(){
        // ---- gather the numbers for our clock 

        const hour_number = pad_number(this.get_hours_till_next_challenge());
        const minute_number = pad_number(this.get_minutes_till_next_challenge());
        const seconds_number = pad_number(this.get_seconds_till_next_challenge());
        
        // ---- give back the clock string
        return `${hour_number}:${minute_number}:${seconds_number}`;
    }
}

let time_keeper_instance = new Time_Keeper();