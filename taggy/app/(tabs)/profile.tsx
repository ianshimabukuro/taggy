import ProfileCard from '@/components/ProfileCard';
import {Text, View} from 'react-native'


export default function Profile(){
    return(
            <ProfileCard 
            name="Ian Shimabukuro" 
            nationality='Brazilian' 
            age={24} 
            major='Engineering' 
            picture='./avatar.png' 
            languages={['Portuguese','English']} 
            hobbies={['Table Tennis','Guitar']}/>
    );
}
