const DAILY_POST_STRUCTURE = {
    "metadata": [
        {
            "tag": "section",
            "id": "",
            "class": [ "sectioned_content_outer" ],
            "inner": [
                // the content within a given post's section element
                {
                    "tag": "div",
                    "id": "",
                    "class": [ "sectioned_content_inner" ],
                    "inner": [
                        {
                            "tag": "div",
                            "id": "",
                            "class": [ "sectioned_content_thumbnail" ],
                            "inner": [
                                {
                                    "tag": "img",
                                    "id": "",
                                    "class": [ "sectioned_content_thumbnail_img" ],
                                    // default source image, gets replaced quick
                                    "src": "%POST_THUMBNAIL_SOURCE%",
                                    "alt":"%POST_THUMBNAIL_ALT_TEXT%",
                                    // no inner element
                                    "inner": []
                                },
                            ],
                        },
                        {
                            "tag": "div",
                            "id": "",
                            "class": [ "sectioned_content_heading" ],
                            "inner": [
                                {
                                    "tag": "h3",
                                    "id": "",
                                    "class": [ "sectioned_content_heading_text" ],
                                    "inner": [
                                        // raw text inside
                                        {
                                            "tag": "",
                                            "plaintext": "[%POST_DATE%] :: %POST_THEME% %POST_DAY%",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            "tag": "div",
                            "id": "",
                            "class": [ "sectioned_content_body" ],
                            "inner": [
                                {
                                    "tag": "div",
                                    "id": "",
                                    "class": [ "%POST_DAY%_post", "daily_post" ],
                                    "inner": [
                                        {
                                            "tag": "p",
                                            "id": "",
                                            "class": [ "daily_heading_theme", "daily_heading_elem" ],
                                            "inner": [
                                                // raw text inside
                                                {
                                                    "tag": "",
                                                    "plaintext": "%POST_THEME% %POST_DAY%s",
                                                },
                                            ],
                                        },
                                        {
                                            "tag": "p",
                                            "id": "",
                                            "class": [ "daily_heading_elem" ],
                                            "inner": [
                                                // raw text inside
                                                {
                                                    "tag": "",
                                                    "plaintext": "%POST_TITLE%",
                                                },
                                            ],
                                        },
                                        {
                                            "tag": "p",
                                            "id": "",
                                            "class": [ "daily_textbody_elem", "%IMPORT_POST_CONTENT%" ],
                                            // // this here might break if we change the name
                                            // "import-html": "/daily/posts/${ daily_post_stub_file }",
                                            "POST_IMPORT_ATTRIBUTE": "/daily/posts/${ daily_post_stub_file }",
                                            "inner": [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    ],
};

export {
    DAILY_POST_STRUCTURE
};