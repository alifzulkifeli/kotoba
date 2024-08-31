import Card from '@/components/card';
import Page from '@/components/page';
import Section from '@/components/section';
import { supabase } from '@/utils/supabase';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const KanjiAdd = () => {
    // Define state to hold the input value
    const [inputValue, setInputValue] = useState<string>('');




    const [kanji, set_kanji] = useState<string>('');
    const [meaning, set_meaning] = useState<string>('');
    const [level, set_level] = useState<string>('');
    const [kunyomi, set_kunyomi] = useState<string>('');
    const [onyomi, set_onyomi] = useState<string>('');
    const [inputsDict, setInputsDictDict] = useState([{ word: "", kana: "", meaning: "" }]);
    const [example_sentance, set_example_sentance] = useState<string>('');
    const [example_meaning, set_example_meaning] = useState<string>('');


    const resetForm = () => {
        set_kanji("")
        set_meaning("")
        set_level("")
        set_kunyomi("")
        set_onyomi("")
        setInputsDictDict([{ word: "", kana: "", meaning: "" }])
        set_example_sentance("")
        set_example_meaning("")
    }



    const handleAddInput = () => {
        setInputsDictDict([...inputsDict, { word: "", kana: "", meaning: "" }]);
    };

    const handleChange = async (event: any, index: number) => {
        let { name, value } = event.target;
        let onChangeValue: any = [...inputsDict];
        onChangeValue[index][name] = value;
        const kuroshiro = new Kuroshiro();

        console.log(name == 'kana' && value == ".");
        
        if (name == 'kana' && value == ".") {
            
            await kuroshiro.init(new KuromojiAnalyzer());
            const result = await kuroshiro.convert( onChangeValue[index]["word"], { to: "hiragana" });
            onChangeValue[index]["kana"] = result;
        }

        setInputsDictDict(onChangeValue);
        

    };

    const handleDeleteInput = (index: any) => {
        const newArray = [...inputsDict];
        newArray.splice(index, 1);
        setInputsDictDict(newArray);
    };



    const handleSubmit = async () => {

        if (!kanji) {
            toast.error("kanji cannot be empty")
            return 
        }
        let { data: k, error } = await supabase
            .from('kanji')
            .select('*').eq("kanji", kanji)
        console.log(k);

        if (error) {
            toast.error(error.message)
        }

        if (k?.length == 0) {
            let res = await supabase
                .from('kanji')
                .insert([
                    {
                        kanji: kanji,
                        meaning: meaning,
                        level,
                        kunyomi,
                        onyomi,
                        word_list: inputsDict,
                        example_sentance,
                        example_meaning
                    },
                ])
                .select()

            if (!res.error) {
                toast.success("Added");
                resetForm()
            } else {
                toast.error(res.error.message)
            }
        } else {
            toast.error("Item already exist")
            resetForm()
        }
    };




    return (
        <Page>
            <Section>
                <div className="flex justify-center w-full items-center  text-white ">
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                    />

                    {/* First Row */}
                    <div className="flex w-full justify-center items-center">
                        <input
                            name="kana"
                            type="text"
                            value={kanji}
                            className='shadow border w-1/3 rounded py-2 px-1 mr-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                            onChange={(e) => set_kanji(e.target.value)}
                            placeholder=' kanji'


                        />       <input
                            name="kana"
                            type="text"
                            value={meaning}
                            className='shadow border w-1/2 rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                            onChange={(e) => set_meaning(e.target.value)}
                            placeholder='meaning'

                        />

                        <input
                            name="kana"
                            type="text"
                            value={level}
                            className='shadow border w-1/6 rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                            onChange={(e) => set_level(e.target.value)}
                            placeholder='level'

                        />
                    </div>


                </div>

                {/* Second Row */}
                <div className="flex w-full justify-center items-center py-2">
                    <input
                        name="kana"
                        type="text"
                        value={kunyomi}
                        className='shadow border w-1/2 rounded py-2 px-1 mr-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                        onChange={(e) => set_kunyomi(e.target.value)}
                        placeholder=' kunyomi'

                    />       <input
                        name="kana"
                        type="text"
                        value={onyomi}
                        className='shadow border w-1/2 rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                        onChange={(e) => set_onyomi(e.target.value)}
                        placeholder=' onyomi'

                    />


                </div>


                {/* Third Row */}
                <div className="container">
                    {inputsDict.map((item, index) => (
                        <div className="input_container py-1" key={index}>
                            <input
                                name="word"
                                type="text"
                                className='shadow border rounded py-2 px-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                                value={item.word}
                                onChange={(event) => handleChange(event, index)}
                                placeholder=' word'
                            />
                            <input
                                name="kana"
                                type="text"
                                value={item.kana}
                                className='shadow border rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                                onChange={(event) => handleChange(event, index)}
                                placeholder=' kana'

                            />

                            <input
                                name="meaning"
                                type="text"
                                value={item.meaning}
                                className='shadow border rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                                onChange={(event) => handleChange(event, index)}
                                placeholder=' meaning'
                            />
                            {inputsDict.length > 1 && (
                                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 mr-4 border border-red-700 rounded' onClick={() => handleDeleteInput(index)}>Delete</button>
                            )}
                            {index === inputsDict.length - 1 && (
                                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 border border-blue-700 rounded' onClick={() => handleAddInput()}>Add</button>
                            )}
                        </div>
                    ))}

                </div>



                {/* Fourth Row */}
                <div className="flex w-full justify-center pt-2 items-center">

                    <input
                        name="kana"
                        type="text"
                        value={example_sentance}
                        className='shadow border w-1/2 rounded py-2 px-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                        onChange={(e) => set_example_sentance(e.target.value)}
                        placeholder=' example_sentance'

                    />       <input
                        name="kana"
                        type="text"
                        value={example_meaning}
                        className='shadow border w-1/2 rounded py-2 mx-1 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-inherit'
                        onChange={(e) => set_example_meaning(e.target.value)}
                        placeholder='example_meaning'

                    />
                </div>


                {/* Submit Row */}
                <div className="flex w-full justify-center pt-2 items-center">

                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 border border-blue-700 rounded' onClick={() => handleSubmit()}>Submit</button>

                </div>

            </Section>
        </Page>
    );
}

export default KanjiAdd;