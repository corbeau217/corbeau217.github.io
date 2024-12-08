import { Time_Keeper } from "./time_keeper.js";
import { pad_number } from "./util.js";

export class AOC_Daily_Card_builder {
    constructor(){
        this.initialise();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initialise(){
        // start with less than none to force a rebuild on next update
        this.challenges_available = Time_Keeper.get_instance().get_number_of_challenges_available();
        
            // build them
            this.build_available_cards();
    }
    build_available_cards(){
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
        const card_body_code = `            <section class="aoc_card_wrapper_outer">
                <div class="aoc_card_wrapper_inner">
                    <div class="aoc_card_thumbnail"><code class="aoc_thumbnail_day_number">[${day_number_padded}]</code></div>
                    <div class="aoc_card_heading">
                        <h3 class="aoc_card_main_heading_text">DAY - ${day_number}</h3>
                        <p class="aoc_sub_text"><code>[ <a href="https://adventofcode.com/2024/day/${day_number}" class="aoc_reference_link">details</a> ] [ <a href="https://adventofcode.com/2024/day/${day_number}/input" class="aoc_reference_link">input</a> ]</code></p>
                    </div>
                    <div class="aoc_card_body_block">
                        <div class="aoc_card_body_wrapper">
                            <hr />
                            <p class="brief_heading_elem"><label for="${data_input_id}">input data</label></p>
                            <p><textarea class="aoc_data_element" id="${data_input_id}" name="${data_input_id}" rows="4" cols="32"  placeholder="&lt; paste input here &gt;"></textarea></p>
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
            card_body_code: `            <section class="aoc_card_wrapper_outer">
                <div class="aoc_card_wrapper_inner">
                    <div class="aoc_card_thumbnail"><code class="aoc_thumbnail_day_number">[${pad_number(next_challenge_number)}]</code></div>
                    <div class="aoc_card_heading">
                        <h3 class="aoc_card_main_heading_text">DAY - ${next_challenge_number}</h3>
                        <p class="aoc_sub_text"><i>(Soon&trade;)</i> <code>[ <a href="https://adventofcode.com/2024/day/${next_challenge_number}" class="aoc_reference_link">details</a> ]</code></p>
                    </div>
                    <div class="aoc_card_body_block">
                        <div class="aoc_card_body_wrapper">
                            <hr />
                            <p class="brief_heading_elem">time until next challenge available</p>
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