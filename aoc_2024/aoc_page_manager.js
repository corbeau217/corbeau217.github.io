import { AOC_Daily_Card_builder } from "./page_builder.js";
import { Time_Keeper } from "./time_keeper.js";
import { ADVENT_CALENDER_DAYS } from "./util.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class AdventOfCode_Page_Manager {
    constructor(){
        this.initialise_daily_card_builder();
        this.initialise();
        this.hook_load_event();
    }
    initialise_daily_card_builder(){
        this.flow_elem_id = "aoc_flow_body_elem_id";
        // TODO: merge the data from this into the daily block list
        /**
         * handles building our daily card code for our flow body
         */
        this.daily_card_builder = new AOC_Daily_Card_builder();
    }
    initialise(){
        this.time_between_timer_updates_in_millis = 1000;
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
            show_result: true,
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
        this.daily_block_list[day_index].parts.push({
            part_function: code_block,
            part_answer_element: element_id,
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

        // do the rest of the page main
        this.construct_page_daily_cards();
        this.replace_page_run_command();
        this.map_code_blocks();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    construct_page_daily_cards(){
        let inner_code_value = "";
        // add all the daily card code blocks to the flow body
        this.daily_card_builder.get_daily_card_data_blocks().forEach(card_data_block => {
            inner_code_value += card_data_block.card_body_code;
        });
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
        this.daily_block_list[day_index].show_result = false;
    }
    turn_on_day(day_index){
        this.daily_block_list[day_index].show_result = true;
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