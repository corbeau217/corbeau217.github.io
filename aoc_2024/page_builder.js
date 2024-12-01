
const AOC_START_EPOCH_MILLIS = 1733029200000;
export class AOC_Daily_Card_builder {
    constructor(){
        this.initialise_references();
        this.initialise_availability_data();
        this.check_days_available();
        this.build_cards_available();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initialise_references(){
        this.flow_elem_id = "aoc_flow_body_elem_id";
    }
    initialise_availability_data(){
        this.start_date = new Date();
        this.start_date.setTime(AOC_START_EPOCH_MILLIS);
        this.challenges_available = 1; //assume 1
    }
    check_days_available(){
        const right_now = Date.now();
        const time_since_first = right_now - this.start_date;
        const seconds_since_first = time_since_first.valueOf() / 1000;
        const hours_since_first = seconds_since_first/3600;
        const days_since_first = Math.floor(hours_since_first/24);
        // confine to between 1 and 31
        this.challenges_available = Math.min(Math.max(days_since_first+1, 1), 31);
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
                    <div class="sectioned_content_heading"><a href="https://adventofcode.com/2024/day/${day_number}"><h3 class="sectioned_content_heading_text">DAY - ${day_number}</h3></a></div>
                    <div class="sectioned_content_body">
                        <div class="techdemo_brief">
                            <hr />
                            <p class="brief_heading_elem"><label for="${data_input_id}">input data</label><sup>[<a href="https://adventofcode.com/2024/day/${day_number}/input"><code>source</code></a>]</sup></p>
                            <p><textarea class="aoc_data_element" id="${data_input_id}" name="${data_input_id}" rows="4" cols="50"  placeholder="data input here..."></textarea></p>
                            <hr />
                            <p class="brief_heading_elem">Answer pt. 1:</p>
                            <div class="aoc_answer_wrapper">
                                <button class="aoc_answer_button" onclick="run_block('${data_input_id}',${day_number},1)">&gt;</button>
                                <code class="aoc_answer_element" id="${answer_part_1_id}" >TBD</code>
                            </div>
                            <hr />
                            <p class="brief_heading_elem">Answer pt. 2:</p>
                            <div class="aoc_answer_wrapper">
                                <button class="aoc_answer_button" onclick="run_block('${data_input_id}',${day_number},2)">&gt;</button>
                                <code class="aoc_answer_element" id="${answer_part_2_id}" >TBD</code>
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

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}