import {Flex} from '@chakra-ui/react';

export const Container = (props) => {
    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            bg="gray.50"
            color="black"
            {...props}
        />
    );
};
