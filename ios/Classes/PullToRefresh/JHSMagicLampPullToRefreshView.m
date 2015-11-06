//
//  JHSMagicLampPullToRefreshView.m
//  JU
//
//  Created by lamo on 14/12/23.
//  Copyright (c) 2014年 ju.taobao.com. All rights reserved.
//

#import "JHSMagicLampPullToRefreshView.h"
#import "UIView+SNEdge.h"
#import "POP.h"

@implementation JHSMagicLampPullToRefreshView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.clipsToBounds = YES;

        _lampView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"JHSKit.bundle/magic_lamp"]];
        _circleView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"JHSKit.bundle/circle_around_lamp"]];
        _textView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"JHSKit.bundle/slogon_text"]];

        _circleView.alpha = .0;

        [self addSubview:_lampView];
        [self addSubview:_circleView];
        [self addSubview:_textView];
    }

    return self;
}

- (CGFloat)minDraggingDistance {
    return 72.0;
}

- (void)setReady:(BOOL)ready {
    if (_ready == ready) {
        return;
    }

    _ready = ready;

    /*
     * 8c9aba 和之前使用Core Animation实现，根据Core Animation特性，
     * 隐藏/显示动画不会跟随布局的改变(layoutWithPresenterState:)而移动
     * 所以改为使用Pop实现
     *
     * Core
     * Animation会直接修改CALayer对象的值，而动画则在提交后交给单独线程/进程执行，后续的布局改动不会对动画线程/进程造成影响
     * 这样的好处是CALayer对象的属性/方法可以真实地反映对象的状态，与逻辑统一
     * 比如之前的实现中可以移除_ready成员变量，直接读写_circleView.layer.hidden
     *
     * 坏处是返回的值与看到的效果不统一，CALayer的presentationLayer属性的对象反映当前显示的状态
     * pop框架会真实地修改对象的属性
     */
    POPBasicAnimation *animation = [POPBasicAnimation animationWithPropertyNamed:kPOPViewAlpha];
    animation.duration = .15;
    animation.fromValue = @(_ready ? .0 : 1.0);
    animation.toValue = @(_ready ? 1.0 : .0);

    [_circleView pop_addAnimation:animation forKey:@"hidingAnimation"];
}

#define kSecondsPerCircle (1.0)
#define kKeyPathRotationZ @"transform.rotation.z"
#define kAnimationKeyRotation @"RotationAnimation"

- (void)setLoading:(BOOL)loading {
    if (_loading == loading) {
        return;
    }

    _loading = loading;

    if (_loading) {
        CABasicAnimation *a = [CABasicAnimation animationWithKeyPath:kKeyPathRotationZ];
        a.beginTime = [_circleView.layer convertTime:CACurrentMediaTime() fromLayer:nil];
        a.toValue = @(M_PI * 2.0);
        a.duration = kSecondsPerCircle;
        a.repeatCount = CGFLOAT_MAX;

        [_circleView.layer addAnimation:a forKey:kAnimationKeyRotation];
    } else {
        CALayer *presentationLayer = (CALayer *)_circleView.layer.presentationLayer;
        CGFloat angle = [[presentationLayer valueForKeyPath:kKeyPathRotationZ] floatValue];
        if (angle != .0) {
            angle = angle < .0 ? (M_PI * 2.0 + angle) : angle;

            CABasicAnimation *a = [CABasicAnimation animationWithKeyPath:kKeyPathRotationZ];
            a.fromValue = @(angle);
            a.toValue = @(M_PI * 2.0);
            a.timingFunction =
                [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseIn];
            a.duration = kSecondsPerCircle * (1.0 - angle / (M_PI * 2.0)) * .6;

            [_circleView.layer addAnimation:a forKey:kAnimationKeyRotation];
        } else {
            [_circleView.layer removeAnimationForKey:kAnimationKeyRotation];
        }
    }
}

// CA框架中的动画，layer移出hierarchy后被删除，需要在view加回window后重新添加
// 第一次添加动画时应该显式设置animation实例的beginTime属性，并且在之后保持不变，这样恢复后就像没有停止过一样
- (void)willMoveToWindow:(UIWindow *)newWindow {
    [super willMoveToWindow:newWindow];

    if (newWindow) {
        return;
    }

    if (!_loading) {
        return;
    }

    _storedAnimation = [[_circleView.layer animationForKey:kAnimationKeyRotation] copy];

}

- (void)didMoveToWindow {
    [super didMoveToWindow];

    if (!self.window) {
        return;
    }

    if (!_loading) {
        _storedAnimation = nil;
        return;
    }


    [_circleView.layer addAnimation:_storedAnimation forKey:kAnimationKeyRotation];
    _storedAnimation = nil;
}

- (void)layoutWithPresenterState:(id<JHSPullToRefreshPresenter>)state {
    _circleView.center = CGPointMake(self.sn_width / 2.0, self.sn_height - state.visibleHeight +
                                                              _circleView.sn_height / 2.0 + 5.0);
    _lampView.center = _circleView.center;

    _textView.center = CGPointMake(self.bounds.size.width / 2.0,
                                   _circleView.sn_bottom + 5.0 + _textView.sn_height / 2.0);
}

@end
