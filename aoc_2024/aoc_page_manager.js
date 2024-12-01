import { AOC_Daily_Card_builder } from "./page_builder.js";

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
        /**
         * handles building our daily card code for our flow body
         */
        this.daily_card_builder = new AOC_Daily_Card_builder();
    }
    initialise(){
        /**
         * list of daily blocks 
         */
        this.daily_block_list = [];
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
            day_function: code_block,
            element_id: element_id,
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
            this.start();
        } );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * makes the blocks run
     */
    start(){
        // 
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gather inputs and run the blocks
     */
    page_main(){
        this.construct_page_daily_cards();
        this.replace_page_run_command();
        this.map_code_blocks();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    construct_page_daily_cards(){
        // TODO: add the daily card code blocks to the flow body
    }
    replace_page_run_command(){
        // TODO: replace the run_block command on our window object
        //  run_block(input_element_id, day_number, part_number)
        window.run_block = (input_element_id, day_number, part_number)=>{
            console.log("running replaced code");
        };
    }

    // /**
    //  * runs all blocks we have
    //  */
    // run_blocks(){
    //     // for all the day data blocks
    //     this.daily_block_list.forEach(daily_block_data => {
    //         if(daily_block_data.show_result){
    //             // ----------------------------------------------------------------
    //             // ----- get the current items for it
                
    //             const day_data = daily_block_data.data;
    //             const day_part_maps = daily_block_data.parts;
                
    //             // ----------------------------------------------------------------
    //             // ----- do the content
                
    //             day_part_maps.forEach(part_mapping => {
    //                 // run the block 
    //                 let answer = part_mapping.day_function(day_data);
    //                 // update the element
    //                 AdventOfCode_Page_Manager.set_element_value(part_mapping.element_id, answer);
    //             });
                
    //             // ---------------------------------------------------------------- 
    //         }
    //     });
    // }

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

    turn_off_day(day_index){
        this.daily_block_list[day_index].show_result = false;
    }
    turn_on_day(day_index){
        this.daily_block_list[day_index].show_result = true;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################