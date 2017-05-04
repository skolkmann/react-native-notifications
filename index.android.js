import React, { Component } from 'react'
import {
  Animated,
  AppRegistry,
  Button,
  Dimensions,
  Easing,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'

const PREVIEW_HEIGHT = 64

const { height, width } = Dimensions.get('window')

export default class notifications extends Component {
  constructor(props) {
    super(props)

    this.currentY = 0

    this.state = {
      isVisible: false,
      isFullScreen: false,
      animatedY: new Animated.Value(0),
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.animatedY.setValue(this.currentY)
      },
      onPanResponderMove: (event, gestureState) => {
        this.state.animatedY.setValue(this.currentY + gestureState.dy)
      },
      onPanResponderRelease: (event, gestureState) => {
        clearTimeout(this.timeout)

        this.currentY = this.state.animatedY._value

        if (gestureState.vy > 0) {
          this.slideDownAnimation.start(() => {
            this.currentY = this.state.animatedY._value
            this.state.isFullScreen = true
          })
        } else {
          this.state.isFullScreen = false

          this.slideUpAnimation.start(() => {
            this.currentY = this.state.animatedY._value
            this.hide()
          })
        }
      }
    })

    this.slideDownAnimation = Animated.timing(
      this.state.animatedY,
      {
        toValue: height,
        easing: Easing.bounce,
        duration: 300,
      }
    )

    this.slideUpAnimation = Animated.timing(
      this.state.animatedY,
      {
        toValue: PREVIEW_HEIGHT,
        duration: 100,
      }
    )

    this.showAnimation = Animated.timing(
      this.state.animatedY,
      {
        toValue: PREVIEW_HEIGHT,
        duration: 250,
      }
    )

    this.hideAnimation = Animated.timing(
      this.state.animatedY,
      {
        toValue: 0,
        duration: 250,
      }
    )
  }

  show() {
    clearTimeout(this.timeout)

    const sequence = this.state.isVisible ?
      [this.hideAnimation, this.showAnimation] :
      [this.showAnimation]

    this.state.isVisible = true

    Animated.sequence(sequence).start(
      () => {
        this.currentY = PREVIEW_HEIGHT

        this.timeout = setTimeout(
          () => this.hide(),
          2000,
        )
      }
    )
  }

  hide() {
    this.hideAnimation.start(
      () => {
        this.state.isVisible = false
      }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Button
          onPress={() => this.show()}
          title="Show"
          color="#19B5FE"
        />
        <Animated.View
          { ...this.panResponder.panHandlers }
          style={{
            ...styles.notifications,
            transform: [{ translateY: this.state.animatedY }],
          }}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  notifications: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -height,
    height: height,
    backgroundColor: '#333',
  },
}

AppRegistry.registerComponent('notifications', () => notifications)
