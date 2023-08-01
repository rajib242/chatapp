import {Text,HStack,Avatar} from '@chakra-ui/react';

const Message = ({text,uri,user="other"}) =>{
	return(
      <HStack alignSelf={user === "me"? "flex-end":"flex-start"} borderRadious={"base"} paddingY={"2"} bg="gray.100" paddingX={user === "me"? "4":"2"}>
          {
          user === "other" && <Avatar src={uri} />
          }
          <Text>{text}</Text>
          {
          user === "me" && <Avatar src={uri} />
          }
      </HStack>
   )
}

export default Message;