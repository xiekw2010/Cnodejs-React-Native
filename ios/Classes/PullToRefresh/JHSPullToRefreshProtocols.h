//
//  JHSPullToRefreshProtocols.h
//  JU
//
//  Created by lamo on 14/12/23.
//  Copyright (c) 2014年 ju.taobao.com. All rights reserved.
//

#ifndef JU_JHSPullToRefreshProtocols_h
#define JU_JHSPullToRefreshProtocols_h

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, JHSPullToRefreshPosition) {
    kJHSPullToRefreshPositionTop,
    kJHSPullToRefreshPositionBottom
};

@protocol JHSPullToRefreshViewObject;

@protocol JHSPullToRefreshPresenter

@property(nonatomic, readonly) BOOL dragging;
@property(nonatomic, readonly) CGFloat visibleHeight;
@property(nonatomic, readonly) JHSPullToRefreshPosition position;
@property(nonatomic, readonly) BOOL alwaysOnTop;

@property(nonatomic, strong) UIView<JHSPullToRefreshViewObject> *view;

@end

@protocol JHSPullToRefreshViewObject

@property(nonatomic, assign) BOOL ready;
@property(nonatomic, assign) BOOL loading;
@property(nonatomic, readonly) CGFloat minDraggingDistance;

- (void)layoutWithPresenterState:(id<JHSPullToRefreshPresenter>)state;

@optional

/**
 * 控件值，由实现定义其实际意义
 */
@property(nonatomic, readonly) CGFloat value;

@end

#endif
