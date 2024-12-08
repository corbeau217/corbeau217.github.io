import { AOC_Daily_Card_builder } from "./page_builder.js";
import { Time_Keeper } from "./time_keeper.js";
import { ADVENT_CALENDER_DAYS } from "./util.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class AdventOfCode_Page_Manager {
    constructor(){
        this.initialise();
        this.hook_load_event();
    }
    initialise(){
        this.flow_elem_id = "aoc_flow_body_elem_id";
        /**
         * handles building our daily card code for our flow body
         */
        this.daily_card_builder = new AOC_Daily_Card_builder();

        this.time_between_timer_updates_in_millis = 1000;
        this.show_unfinished = false;
        this.timer_constructed_card = null;

        /**
         * list of daily blocks 
         */
        this.daily_block_list = [];
        for (let i = 0; i < ADVENT_CALENDER_DAYS; i++) {
            this.create_day();
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * adding a days content to the lists
     * @param {*} input_data the input data for the day
     * @returns the index of the block
     */
    create_day(){
        let index = this.daily_block_list.length;
        this.daily_block_list.push({
            parts: [],
            show_card: true,
            constructed_card: "",
        });
        return index;
    }
    /**
     * adds a part to the day by index
     * @param {*} day_index index of the day
     * @param {*} code_block function to process the data
     * @param {*} element_id the id of the element to modify with the answer
     */
    add_part_to_day(day_index, code_block, element_id){
        // assume showing it
        let part_will_display = true;

        if(!this.show_unfinished){
            // when we want only they completed parts
            try {
                if(code_block("") === "unfinished"){
                    // when unfinished and dont want it to be shown
                    part_will_display = false;
                }
            } catch (error) {
                // errors when empty given, so possibly done/started
                // zzz
            }
        }

        // add the part
        this.daily_block_list[day_index].parts.push({
            part_function: code_block,
            part_answer_element: element_id,
            display: part_will_display,
        });

    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    hook_load_event(){
        window.addEventListener( "load", (event)=>{
            if(this.verbose_logging){ console.log("--- preparing managed page content ---"); }
            this.page_main();
    
            if(this.verbose_logging){ console.log("--- starting apps ---"); }
            this.start_next_challenge_timer();
        } );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    start_next_challenge_timer(){
        // if there's future cards to make
        if(this.daily_card_builder.challenges_available < ADVENT_CALENDER_DAYS){
            // for use inside the closure
            let page_manager_reference = this;
            // prepare a reference to use
            this.next_challenge_timer_element = AdventOfCode_Page_Manager.fetch_element("aoc_time_left_until_next_counter");
            // update our timer for how long until the next challenge
            setInterval(
                function () {
                    requestAnimationFrame(
                            (t) => {page_manager_reference.timer_update( t )}
                        );
                },
                this.time_between_timer_updates_in_millis
            );
        }
    }
    timer_update( app_time_elapsed ){
        let time_keeper_instance = Time_Keeper.get_instance();
        // ===== update the time keeper

        time_keeper_instance.update_timer();

        // =================================================================
        // ===== update the body element
        this.next_challenge_timer_element.innerHTML = time_keeper_instance.get_time_string_till_next_challenge();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gather inputs and run the blocks
     */
    page_main(){
        /**
         * pre-gathered flow element object reference for manipulation
         */
        this.flow_element_object = AdventOfCode_Page_Manager.fetch_element(this.flow_elem_id);
        // wipe the inside
        this.flow_element_object.innerHTML = "";

        // prepare the code blocks
        this.map_code_blocks();
        this.fetch_card_data_blocks();
        // do the rest of the page main
        this.add_page_daily_cards_to_page();
        this.replace_page_run_command();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    fetch_card_data_blocks(){
        let built_code_blocks = this.daily_card_builder.get_daily_card_data_blocks();

        let number_of_cards = this.daily_card_builder.challenges_available;
        let showing_timer = false;
        if(number_of_cards < ADVENT_CALENDER_DAYS){
            showing_timer = true;
        }

        // loop all the code we were given and add to our card data
        for (let index = 0; index < number_of_cards; index++) {
            const current_code_block = built_code_blocks[index];
            
            // add tthe code to the block
            this.daily_block_list[index].constructed_card = current_code_block;
        }

        // save timer code
        if(showing_timer){
            // grab the last, since it's the timer block
            this.timer_constructed_card = built_code_blocks[this.number_of_cards+1];
        }

        // test for when they should be shown or not
        if(!this.show_unfinished){
            this.update_if_cards_are_shown();
        }
    }
    update_if_cards_are_shown(){
        // loop all cards
        for (let card_index = 0; card_index < this.daily_block_list.length; card_index++) {
            const current_card_parts_data = this.daily_block_list[card_index].parts;
            
            // assume nope
            let showing_card = false;

            // loop all parts
            for (let part_index = 0; part_index < current_card_parts_data.length; part_index++) {
                const part_data = current_card_parts_data[part_index];
                
                if (part_data.display) {
                    // proven to be not unfinished, show it
                    showing_card = true;
                    break;
                }
            }

            this.daily_block_list[card_index].show_card = showing_card;
        }
    }
    add_page_daily_cards_to_page(){
        let inner_code_value = "";

        // add all the daily card code blocks to the flow body
        this.daily_block_list.forEach(card_data_block => {
            //when showing 

            if(card_data_block.show_card){
                inner_code_value += card_data_block.constructed_card.card_body_code;
            }
        });

        // add the timer card data if exists
        if(this.timer_constructed_card != null){
            inner_code_value += this.timer_constructed_card.card_body_code;
        }

        this.flow_element_object.innerHTML = inner_code_value;
    }
    replace_page_run_command(){
        // self reference for use inside the replacement function
        const page_manager = this;

        // replace the function
        window.run_block = (input_element_id, day_number, part_number) => {
            const input_data = AdventOfCode_Page_Manager.get_data_from_textbox(input_element_id);
            const relevant_day_mappings = page_manager.daily_block_list[day_number-1];
            // check we have data to use
            if(relevant_day_mappings!=undefined){
                // have data, check for parts
                const relevant_part = relevant_day_mappings.parts[part_number-1];
                if(relevant_part!=undefined){
                    // find the answer
                    let answer = relevant_part.part_function(input_data);
                    // add it to the content
                    AdventOfCode_Page_Manager.set_element_value(relevant_part.part_answer_element,answer);
                }
            }
        };
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * to be overriden
     */
    map_code_blocks(){}

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    turn_off_day(day_index){
        this.daily_block_list[day_index].show_card = false;
    }
    turn_on_day(day_index){
        this.daily_block_list[day_index].show_card = true;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gets element from the document by id
     * @param {*} element_id 
     * @returns 
     */
    static fetch_element(element_id){
        return document.querySelector(`#${element_id}`);
    }

    /**
     * set the content of an item
     * @param {*} id 
     * @param {*} value 
     */
    static set_element_value(id, value){
        let elem = AdventOfCode_Page_Manager.fetch_element(id);
        elem.innerHTML = value;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    static get_data_from_textbox(element_id){
        const data_textbox = AdventOfCode_Page_Manager.fetch_element(element_id);
        return data_textbox.value;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################