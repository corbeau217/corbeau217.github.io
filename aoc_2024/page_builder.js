
const AOC_START_EPOCH_MILLIS = 1733029200000;
export class AOC_Daily_Card_builder {
    constructor(){
        this.initialise_availability_data();
        this.check_days_available();
        this.build_cards_available();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initialise_availability_data(){
        this.start_date = new Date();
        this.start_date.setTime(AOC_START_EPOCH_MILLIS);
        this.challenges_available = 1; //assume 1
    }
    update_time_data( new_time ){
        this.right_now = new_time;
        this.time_since_first = this.right_now - this.start_date;
        this.days_in_milliseconds = 1000 * 60 * 60 * 24;
        this.days_since_first = Math.floor(this.time_since_first.valueOf() / this.days_in_milliseconds);

        /**
         * time in milliseconds until the next challenge
         */
        this.milliseconds_till_next = 0;
        // when it has been 30 full days since the release of the first or more
        if(this.days_since_first >= 30){
            // make the value weird to show that it doesnt matter anymore
            this.milliseconds_till_next = -1;
        }
        else{
            // figure it out since it's a real time
            this.milliseconds_till_next = this.days_in_milliseconds - (this.time_since_first.valueOf() % this.days_in_milliseconds);
        }
        this.time_till_next = new Date();
        this.time_till_next.setTime(this.milliseconds_till_next);
    }
    check_days_available(){
        // update our time data first
        this.update_time_data( Date.now() );

        /**
         * confine to between 2 and 31 
         *  including the first day
         */
        this.challenges_available = Math.min(Math.max(this.days_since_first+1, 1), 31);
    }
    build_cards_available(){
        /**
         * list of card blocks ready for being added to our flow body
         * 
         * they end up with the structure in each as:
         * ```
         * {
         *     number: day_number,
         *     input_elem_id: data_input_id,
         *     answer_part_1_id: answer_part_1_id,
         *     answer_part_2_id: answer_part_2_id,
         *     card_body_code: card_body_code,
         * }
         * ```
         */
        this.daily_card_data_blocks = [];

        // all the days available, build their card data
        for (let day_number = 1; day_number <= this.challenges_available; day_number++) {
            // construct and add the card to our list of daily challenge cards
            this.daily_card_data_blocks.push( AOC_Daily_Card_builder.make_daily_card(day_number) );           
        }
        // also include the timer card
        this.daily_card_data_blocks.push( AOC_Daily_Card_builder.make_timer_card(this.challenges_available+1) );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * list of card blocks ready for being added to our flow body
     * 
     * they end up with the structure in each as:
     * ```
     * {
     *     number: day_number,
     *     input_elem_id: data_input_id,
     *     answer_part_1_id: answer_part_1_id,
     *     answer_part_2_id: answer_part_2_id,
     *     card_body_code: card_body_code,
     * }
     * ```
     * @returns the whole list
     */
    get_daily_card_data_blocks(){
        return this.daily_card_data_blocks;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    static make_daily_card(day_number){
        const padded_zero = (day_number<10)?"0":"";
        const day_number_padded = `${padded_zero}${day_number}`;
        // =======================================================

        const data_input_id = `aoc_day_${day_number_padded}_data_input`;
        const answer_part_1_id = `answer_day_${day_number_padded}_1`;
        const answer_part_2_id = `answer_day_${day_number_padded}_2`;
        const card_body_code = `            <section class="sectioned_content_outer">
                <div class="sectioned_content_inner">
                    <div class="sectioned_content_thumbnail"><img class="sectioned_content_thumbnail_img" src="/img/bookicon.png" alt="book icon thumbnail" /></div>
                    <div class="sectioned_content_heading">
                        <h3 class="sectioned_content_heading_text">DAY - ${day_number}</h3>
                        <p class="aoc_sub_text"><code>[ <a href="https://adventofcode.com/2024/day/${day_number}">details</a> ] [ <a href="https://adventofcode.com/2024/day/${day_number}/input">input</a> ]</code></p>
                    </div>
                    <div class="sectioned_content_body">
                        <div class="techdemo_brief">
                            <hr />
                            <p class="brief_heading_elem"><label for="${data_input_id}">input data</label></p>
                            <p><textarea class="aoc_data_element" id="${data_input_id}" name="${data_input_id}" rows="4" cols="32"  placeholder="paste input here"></textarea></p>
                            <hr />
                            <p class="brief_heading_elem">Answer pt. 1:</p>
                            <div class="aoc_answer_wrapper">
                                <button class="aoc_answer_button" onclick="run_block('${data_input_id}',${day_number},1)">&gt;</button>
                                <code class="aoc_answer_element" id="${answer_part_1_id}" >...</code>
                            </div>
                            <hr />
                            <p class="brief_heading_elem">Answer pt. 2:</p>
                            <div class="aoc_answer_wrapper">
                                <button class="aoc_answer_button" onclick="run_block('${data_input_id}',${day_number},2)">&gt;</button>
                                <code class="aoc_answer_element" id="${answer_part_2_id}" >...</code>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>
            </section>`;
        // ...

        // =======================================================
        // give it all to the asker
        return {
            number: day_number,
            input_elem_id: data_input_id,
            answer_part_1_id: answer_part_1_id,
            answer_part_2_id: answer_part_2_id,
            card_body_code: card_body_code,
        };
    }

    /**
     * card to display the time left
     */
    static make_timer_card(next_challenge_number){
        // =======================================================
        return {
            number: next_challenge_number,
            card_body_code: `            <section class="sectioned_content_outer">
                <div class="sectioned_content_inner">
                    <div class="sectioned_content_thumbnail"><img class="sectioned_content_thumbnail_img" src="/img/bookicon.png" alt="book icon thumbnail" /></div>
                    <div class="sectioned_content_heading">
                        <h3 class="sectioned_content_heading_text">DAY - ${next_challenge_number} <i>(COMING SOON)</i></h3>
                        <p class="aoc_sub_text"><code>[ <a href="https://adventofcode.com/2024/day/${next_challenge_number}">details</a> ]</code></p>
                    </div>
                    <div class="sectioned_content_body">
                        <div class="techdemo_brief">
                            <hr />
                            <p class="brief_heading_elem">time left</p>
                            <div class="aoc_timer_wrapper">
                                <code class="aoc_timer_element" id="aoc_time_left_until_next_counter">23:59:59</code>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>
            </section>`,
        };
        
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}