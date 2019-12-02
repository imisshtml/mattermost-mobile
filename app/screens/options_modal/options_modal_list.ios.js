// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Image,
} from 'react-native';
import IconFont from 'react-native-vector-icons/FontAwesome';
import {paddingHorizontal as padding} from 'app/components/safe_area_view/iphone_x_spacing';
import FormattedText from 'app/components/formatted_text';
import {preventDoubleTap} from 'app/utils/tap';

export default class OptionsModalList extends PureComponent {
    static propTypes = {
        items: PropTypes.array.isRequired,
        onCancelPress: PropTypes.func,
        onItemPress: PropTypes.func,
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
        isLandscape: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        items: [],
    };

    handleCancelPress = preventDoubleTap(() => {
        if (this.props.onCancelPress) {
            this.props.onCancelPress();
        }
    });

    handleItemPress = preventDoubleTap((action) => {
        if (!action) {
            return null;
        }
        this.props.onItemPress();
        setTimeout(() => {
            if (typeof action === 'function') {
                action();
            }
        }, 100);
    });

    handleCameraRollPress = preventDoubleTap((action, node) => {
        if (!action) {
            return null;
        }
        this.props.onItemPress();
        setTimeout(() => {
            if (typeof action === 'function') {
                action(node);
            }
        }, 100);
    });

    keyExtractor = (item) => item.node.image.uri;

    renderCameraRollPhoto = (item, action) => {
        return (
            <View style={{padding: 5}} onStartShouldSetResponder={() => true} key={item.node.image.uri}>
                <TouchableOpacity
                    onPress={() => this.handleCameraRollPress(action, item.node)}
                >
                <Image 
                    source={{uri: item.node.image.uri}}
                    style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                    }}
                />
                </TouchableOpacity>
            </View>
        );
    };

    renderCameraRollScroller = (index, action) => {
        const {loadCameraRoll, cameraRoll} = this.props;

        loadCameraRoll();

        return (
            <View key={index}>
                <FlatList
                    horizontal
                    data={cameraRoll}
                    renderItem={({ item }) => this.renderCameraRollPhoto(item, action)}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        );
    };

    renderOptions = () => {
        const {items} = this.props;

        const options = items.map((item, index) => {
            let textComponent;
            let optionIconStyle = style.optionIcon;
            if (typeof item.iconStyle !== 'undefined') {
                optionIconStyle = item.iconStyle;
            }

            if(item.text.id === 'Camera Roll Scroller') {
                return this.renderCameraRollScroller(index, item.action);
            }

            if (item.text.hasOwnProperty('id')) {
                textComponent = (
                    <FormattedText
                        style={[style.optionText, item.textStyle, (!item.icon && {textAlign: 'center'})]}
                        {...item.text}
                    />
                );
            } else {
                textComponent = <Text style={[style.optionText, item.textStyle, (!item.icon && {textAlign: 'center'})]}>{item.text}</Text>;
            }

            return (
                <View
                    key={index}
                    style={[(index < items.length - 1 && style.optionBorder)]}
                >
                    <TouchableOpacity
                        onPress={() => this.handleItemPress(item.action)}
                        style={style.option}
                    >
                        {textComponent}
                        {item.icon &&
                        <IconFont
                            name={item.icon}
                            size={18}
                            style={optionIconStyle}
                        />
                        }
                    </TouchableOpacity>
                </View>
            );
        });

        let title;
        let titleComponent;
        if (this.props.title) {
            if (this.props.title.hasOwnProperty('id')) {
                titleComponent = (
                    <FormattedText
                        style={style.optionTitleText}
                        {...this.props.title}
                    />
                );
            } else {
                titleComponent = <Text style={style.optionTitleText}>{this.props.title}</Text>;
            }

            title = (
                <View
                    key={items.length}
                    style={[style.option, style.optionBorder]}
                >
                    {titleComponent}
                </View>
            );
        }

        return [
            title,
            ...options,
        ];
    };

    render() {
        return (
            <View style={[style.wrapper, padding(this.props.isLandscape)]}>
                <View style={style.optionContainer}>
                    {this.renderOptions()}
                </View>
                <View style={style.optionContainer}>
                    <TouchableOpacity
                        onPress={this.handleCancelPress}
                        style={style.option}
                    >
                        <FormattedText
                            id='channel_modal.cancel'
                            defaultMessage='Cancel'
                            style={style.optionCancelText}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    option: {
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    optionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    optionCancelText: {
        color: '#CC3239',
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
    },
    optionContainer: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    optionIcon: {
        color: '#4E8ACC',
    },
    optionText: {
        color: '#4E8ACC',
        flex: 1,
        fontSize: 20,
    },
    optionTitleText: {
        color: '#7f8180',
        flex: 1,
        textAlign: 'center',
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
